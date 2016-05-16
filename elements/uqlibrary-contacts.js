/**
 * By Jan-Willem Wisgerhof <j.wisgerhof@uq.edu.au>
 */
(function () {
	Polymer({
		is: 'uqlibrary-contacts',
		properties: {
			/**
			 * Required. Whether the app should start in standalone mode or not.
			 * @type Boolean
			 */
			standAlone: {
				type: Object,
				value: true
			},
      /**
       * @type Boolean
       */
      autoLoad: {
        type: Object,
        value: true
      },
      /**
       * List of contact links
       */
      contacts: {
        type: Array,
        value: [],
        observer: '_checkDisabledStatus',
        notify: true
      },
      /**
       * Summary link
       */
      summary: {
        type: Object
      },
      /**
       * Title used in the header
       */
      headerTitle: {
        type: String,
        value: "Ask Us"
      },
			/**
			 * Holds the user account
			 */
			_account: {
				type: Object,
				value: {
					hasSession: false
				}
			},
      /**
       * Whether the chat is online
       */
      _chatOnline: {
        type: Boolean,
        value: false,
        observer: '_checkDisabledStatus'
      },
      /**
       * Url to check the status of the chat
       */
      _chatStatusUrl: {
        type: String,
        value: "https://api2.libanswers.com/1.0/chat/widgets/status/1871"
      },
      /**
       * Whether the chat status has been loaded
       */
      _chatStatusLoaded: {
        type: Boolean,
        value: false,
        notify: true
      }
		},
		ready: function () {
			var self = this;

			this.$.contactsApi.addEventListener('uqlibrary-api-contacts-loaded', function(e) {
				self.contacts = e.detail.items;
        self.summary = e.detail.summary;
			});

			if (this.autoLoad){
				this.$.contactsApi.get();
			}
		},
    /**  Processes successful chat status api response
     * @param {Object} API call response
     * */
    _handleChatStatusResponse: function(response) {
      this._chatStatusLoaded = true;

      if (document.cookie.indexOf("UQLMockData") >= 0) {
        this._chatOnline = true;
        return;
      }
      this._chatOnline = response.detail.data.online;
    },

    /**  Processes error chat status api response
     * @param {Object} API call response
     * */
    _handleChatStatusError: function(response) {
      this._chatStatusLoaded = true;

      if (document.cookie.indexOf("UQLMockData") >= 0) {
        this._chatOnline = true;
        return;
      }

      this._chatOnline = false;
    },
    /**
     * Returns the relevant link for this item
     * @param item
     * @param disabled
     * @returns {*}
     * @private
     */
    _link: function (item, disabled) {
      if (disabled || item.label == 'Chat') {
        // Chat is handled in the actual On Click event
        return "javascript: void(0)";
      } else if (item.linkMobile && this._isMobile()) {
        return item.linkMobile;
      } else {
        return item.link;
      }
    },
    /**
     * Called when a link is clicked
     * @private
     */
    _linkClicked: function (e) {
      if (e.model.item.isDisabled) { return; }

      this.$.ga.addEvent('Click', e.model.item.link);

      // Check if this item has a custom "target" attribute
      if (e.model.item.label == 'Chat') {
        if (this._isMobile()) {
          // On mobile we ignore the targetOptions
          window.open(this._link(e.model.item), '_blank');
        } else {
          window.open(this._link(e.model.item), e.model.item.target, e.model.item.targetOptions || "");
        }
      }
    },
		/**
		 * Toggles the drawer panel of the main UQL app
		 * @private
		 */
		_toggleDrawerPanel: function () {
			this.fire('uqlibrary-toggle-drawer');
		},
    /**
     * Returns whether the user is on a mobile device
     * @returns {boolean}
     * @private
     */
    _isMobile: function () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    /**
     * Called when the chat status has changed. Updates all items' disabled status
     * @private
     */
    _checkDisabledStatus: function () {
      for (var i = 0; i < this.contacts.length; i++) {

        this.contacts[i].isDisabled = (this.contacts[i].disabled == "chat-offline" && !this._chatOnline);
        this.notifyPath('contacts.'+i+'.isDisabled', this.contacts[i].isDisabled);

        if (!this.contacts[i].target) {
          if (this.contacts[i].label != 'Email' && (this.contacts[i].label != 'Phone' || !this._isMobile())) {
            this.contacts[i].target = '_blank';
          }
        }

        if (this.contacts[i].disabled == 'chat-offline') {
          this.contacts[i].isLoading = !this._chatStatusLoaded;
          this.notifyPath('contacts.'+i+'.isLoading', this.contacts[i].isLoading);
        } else {
          this.contacts[i].isLoading = false;
        }
      }
      
      this.fire("uqlibrary-contacts-loaded");
    },
    _disabledClass: function (disabled) {
      return (disabled ? "disabled" : "");
    }
	})
})();