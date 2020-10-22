;(function(){
	/**
	 * 观察者 
	 */
	YT.util.Observable = function(){
	    if(!this.events){
	        this.events = {};
	    }
	    if(this.listeners){
	        this.on(this.listeners);
	        delete this.listeners;
	    }
	};
	YT.override(YT.util.Observable, {
	    filterOptRe: /^(?:scope|delay|single)$/,
	    /**
	     * 触发事件 
	     */
	    fireEvent: function(){
	        var a = Array.prototype.slice.call(arguments, 0),
	            ename = a[0].toLowerCase(),
	            ret = true,
	            ce = this.events[ename],
	            cc,
	            q,
	            c;
	        if (this.eventsSuspended === true) {
	            if (q = this.eventQueue) {
	                q.push(a);
	            }
	        }
	        else if(typeof ce == 'object') {
	            if (ce.bubble){
	                if(ce.fire.apply(ce, a.slice(1)) === false) {
	                    return false;
	                }
	                c = this.getBubbleTarget && this.getBubbleTarget();
	                if(c && c.enableBubble) {
	                    cc = c.events[ename];
	                    if(!cc || typeof cc != 'object' || !cc.bubble) {
	                        c.enableBubble(ename);
	                    }
	                    return c.fireEvent.apply(c, a);
	                }
	            }
	            else {
	                a.shift();
	                ret = ce.fire.apply(ce, a);
	            }
	        }
	        return ret;
	    },
	    /**
	     * 新增监听
	     * @param {} eventName
	     * @param {} fn
	     * @param {} scope
	     * @param {} o
	     */
	    on: function(eventName, fn, scope, o){
	        var e, oe, ce;
	        if (typeof eventName == 'object') {
	            o = eventName;
	            for (e in o){
	                oe = o[e];
	                if (!this.filterOptRe.test(e)) {
	                    this.on(e, oe.fn || oe, oe.scope || o.scope, oe.fn ? oe : o);
	                }
	            }
	        } 
	        else {
	            eventName = eventName.toLowerCase();
	            ce = this.events[eventName] || true;
	            if (typeof ce == 'boolean') {
	                this.events[eventName] = ce = new YT.util.Event(this, eventName);
	            }
	            ce.addListener(fn, scope, typeof o == 'object' ? o : {});
	        }
	    },
	    /**
	     * 卸载监听
	     * @param {} eventName
	     * @param {} fn
	     * @param {} scope
	     */
	    un: function(eventName, fn, scope){
	        var ce = this.events[eventName.toLowerCase()];
	        if (typeof ce == 'object') {
	            ce.removeListener(fn, scope);
	        }
	    }
	});
	
	/**
	 * 触发target
	 */
	function createTargeted(h, o, scope){
	    return function(){
	        if(o.target == arguments[0]){
	            h.apply(scope, Array.prototype.slice.call(arguments, 0));
	        }
	    };
	};
	
	/**
	 * 仅触发1次
	 */
	function createSingle(h, e, fn, scope){
	    return function(){
	        e.removeListener(fn, scope);
	        return h.apply(scope, arguments);
	    };
	};
	
	/**
	 * 延时触发
	 */
	function createDelayed(h, o, l, scope){
	    return function(){
	        var task = new YT.util.DelayedTask();
	        if(!l.tasks) {
	            l.tasks = [];
	        }
	        l.tasks.push(task);
	        task.delay(o.delay || 10, h, scope, Array.prototype.slice.call(arguments, 0));
	    };
	};

	/**
	 * 事件
	 * @param {} obj
	 * @param {} name
	 */
	YT.util.Event = function(obj, name){
	    this.name = name;
	    this.obj = obj;
	    this.listeners = [];
	};
	YT.override(YT.util.Event, {
	    addListener : function(fn, scope, options){
	        var l;
	        scope = scope || this.obj;
	        if(!this.isListening(fn, scope)){
	            l = this.createListener(fn, scope, options);
	            if(this.firing){
	                this.listeners = this.listeners.slice(0);
	            }
	            this.listeners.push(l);
	        }
	    },
	    createListener: function(fn, scope, o){
	        o = o || {}, scope = scope || this.obj;
	        var l = {
	            fn: fn,
	            scope: scope,
	            options: o
	        }, h = fn;
	        if(o.target){
	            h = createTargeted(h, o, scope);
	        }
	        if(o.delay){
	            h = createDelayed(h, o, l, scope);
	        }
	        if(o.single){
	            h = createSingle(h, this, fn, scope);
	        }
	        l.fireFn = h;
	        return l;
	    },
	    findListener : function(fn, scope){
	        var list = this.listeners,
	            i = list.length,
	            l;
	        scope = scope || this.obj;
	        while(i--){
	            l = list[i];
	            if(l){
	                if(l.fn == fn && l.scope == scope){
	                    return i;
	                }
	            }
	        }
	        return -1;
	    },
	    isListening : function(fn, scope){
	        return this.findListener(fn, scope) != -1;
	    },
	    removeListener : function(fn, scope){
	        var index,
	            l,
	            k,
	            ret = false;
	        if((index = this.findListener(fn, scope)) != -1){
	            if (this.firing) {
	                this.listeners = this.listeners.slice(0);
	            }
	            l = this.listeners[index];
	            if(l.task) {
	                l.task.cancel();
	                delete l.task;
	            }
	            k = l.tasks && l.tasks.length;
	            if(k) {
	                while(k--) {
	                    l.tasks[k].cancel();
	                }
	                delete l.tasks;
	            }
	            this.listeners.splice(index, 1);
	            ret = true;
	        }
	        return ret;
	    },
	    clearListeners : function(){
	        var l = me.listeners, i = l.length;
	        while(i--) {
	            this.removeListener(l[i].fn, l[i].scope);
	        }
	    },
	    fire : function(){
	        var listeners = this.listeners,
	            len = listeners.length,
	            i = 0,
	            l;
	        if(len > 0){
	            this.firing = true;
	            var args = Array.prototype.slice.call(arguments, 0);
	            for (; i < len; i++) {
	                l = listeners[i];
	                if(l && l.fireFn.apply(l.scope || this.obj || window, args) === false) {
	                    return (this.firing = false);
	                }
	            }
	        }
	        this.firing = false;
	        return true;
	    }
	});
})();