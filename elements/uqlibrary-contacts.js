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
        value: 'Ask us'
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

      this.$.chatStatusApi.addEventListener('uqlibrary-api-chat-status-loaded', function(e) {
        self._handleChatStatusResponse(e);
      });

      if (this.autoLoad){
        this.$.contactsApi.get();
        this.$.chatStatusApi.get();
      }
    },
    /**  Processes successful chat status api response
     * @param {Object} API call response
     * */
    _handleChatStatusResponse: function(response) {
      this._chatStatusLoaded = true;

      if (response.detail && response.detail.hasOwnProperty('online')) {
        this._chatOnline = response.detail.online;
      }
    },

    /**
     * Returns the relevant link for this item
     * @param item
     * @param disabled
     * @returns {*}
     * @private
     */
    _link: function (item, disabled) {
      if (disabled || item.label === 'Chat') {
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
      var item = e.model.item;

      this.$.ga.addEvent('Click', item.link);

      // Check if this item has a custom "target" attribute
      if (item.label === 'Chat') {
        if (this._isMobile()) {
          // On mobile we ignore the targetOptions
          window.open(item.link, '_blank');
        } else {
          window.open(item.link, item.target, '_blank');
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

        this.contacts[i].isDisabled = (this.contacts[i].disabled === 'chat-offline' && !this._chatOnline);
        this.notifyPath('contacts.'+i+'.isDisabled', this.contacts[i].isDisabled);

        if (this.contacts[i].disabled === 'chat-offline') {
          this.contacts[i].isLoading = !this._chatStatusLoaded;
          this.notifyPath('contacts.'+i+'.isLoading', this.contacts[i].isLoading);
        } else {
          this.contacts[i].isLoading = false;
        }
      }

      this.fire('uqlibrary-contacts-loaded');
    },
    _disabledClass: function (disabled) {
      return (disabled ? 'disabled' : '');
    }
  });
})();