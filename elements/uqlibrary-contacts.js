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
        observer: '_checkDisabledStatus'
      },
      /**
       * Title used in the header
       */
      headerTitle: {
        type: String,
        value: "Contact the Library"
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
      }
		},
		ready: function () {
			var self = this;

      this._checkChatStatus();

			this.$.contactsApi.addEventListener('uqlibrary-api-contacts-loaded', function(e) {
				self.contacts = e.detail.items;
			});

			if (this.autoLoad){
				this.$.contactsApi.get();
			}
		},
    /**
     * Returns the relevant link for this item
     * @param item
     * @returns {*}
     * @private
     */
    _link: function (item) {
      if (item.linkMobile && this._isMobile()) {
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
      if (e.model.item.target) {
        if (this._isMobile()) {
          // On mobile we ignore the targetOptions
          window.open(this._link(e.model.item), e.model.item.target);
        } else {
          window.open(this._link(e.model.item), e.model.item.target, e.model.item.targetOptions || "");
        }
      } else {
        window.location = this._link(e.model.item);
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
     * Checks the chat status. CORS issues force a mock "true" if the mock cookie is set
     * @private
     */
    _checkChatStatus: function () {
      var self = this;

      // Mock
      if (document.cookie.indexOf("UQLMockData") >= 0) {
        self._chatOnline = true;
      } else {
        var xobj = new XMLHttpRequest();
        xobj.open('GET', this._chatStatusUrl, true);
        xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            var json = JSON.parse(xobj.responseText);
            self._chatOnline = json.online;
          }
        };
        xobj.send(null);
      }
    },
    /**
     * Called when the chat status has changed. Updates all items' disabled status
     * @private
     */
    _checkDisabledStatus: function () {
      for (var i = 0; i < this.contacts.length; i++) {
        this.contacts[i].isDisabled = (this.contacts[i].disabled == "chat-offline" && !this._chatOnline);
      }
      
      this.fire("uqlibrary-contacts-loaded");
    },
    _disabledClass: function (item) {
      return (item.isDisabled ? "disabled" : "");
    }
	})
})();