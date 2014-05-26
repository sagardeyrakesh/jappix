/*

Jappix - An open social platform
These are the filtering JS script for Jappix

-------------------------------------------------

License: AGPL
Authors: Valérian Saliou, Maranda

*/

// Bundle
var Filter = (function () {

    /**
     * Alias of this
     * @private
     */
    var self = {};


    /* Constants */
    self.message_regex = {
        'commands': {
            'me': /((^)|((.+)(>)))(\/me )([^<]+)/
        },

        'emotes': {
            'angry': [
                /(:-?@)($|\s|<)/gi,
                '$2'
            ],

            'bat': [
                /(:-?\[)($|\s|<)/gi,
                '$2'
            ],

            'beer': [
                /(\(B\))($|\s|<)/g,
                '$2'
            ],

            'biggrin': [
                /((:-?D)|(XD))($|\s|<)/gi,
                '$4'
            ],

            'blush': [
                /(:-?\$)($|\s|<)/gi,
                '$2'
            ],

            'boy': [
                /(\(Z\))($|\s|<)/g,
                '$2'
            ],

            'brflower': [
                /(\(W\))($|\s|<)/g,
                '$2'
            ],

            'brheart': [
                /((&lt;\/3)|(\(U\)))($|\s|<)/g,
                '$4'
            ],

            'coffee': [
                /(\(C\))($|\s|<)/g,
                '$2'
            ],

            'coolglasses': [
                /((8-\))|(\(H\)))($|\s|<)/g,
                '$4'
            ],

            'cry': [
                /(:'-?\()($|\s|<)/gi,
                '$2'
            ],

            'cuffs': [
                /(\(%\))($|\s|<)/g,
                '$2'
            ],

            'devil': [
                /(\]:-?&gt;)($|\s|<)/gi,
                '$2'
            ],

            'drink': [
                /(\(D\))($|\s|<)/g,
                '$2'
            ],

            'flower': [
                /(@}-&gt;--)($|\s|<)/gi,
                '$2'
            ],

            'frowning': [
                /((:-?\/)|(:-?S))($|\s|<)/gi,
                '$4'
            ],

            'girl': [
                /(\(X\))($|\s|<)/g,
                '$2'
            ],

            'heart': [
                /((&lt;3)|(\(L\)))($|\s|<)/g,
                '$4'
            ],

            'hugleft': [
                /(\(}\))($|\s|<)/g,
                '$2'
            ],

            'hugright': [
                /(\({\))($|\s|<)/g,
                '$2'
            ],

            'kis': [
                /(:-?{})($|\s|<)/gi,
                '$2'
            ],

            'lamp': [
                /(\(I\))($|\s|<)/g,
                '$2'
            ],

            'lion': [
                /(:-?3)($|\s|<)/gi,
                '$2'
            ],

            'mail': [
                /(\(E\))($|\s|<)/g,
                '$2'
            ],

            'moon': [
                /(\(S\))($|\s|<)/g,
                '$2'
            ],

            'music': [
                /(\(8\))($|\s|<)/g,
                '$2'
            ],

            'oh': [
                /((=-?O)|(:-?O))($|\s|<)/gi,
                '$4'
            ],

            'phone': [
                /(\(T\))($|\s|<)/g,
                '$2'
            ],

            'photo': [
                /(\(P\))($|\s|<)/g,
                '$2'
            ],

            'puke': [
                /(:-?!)($|\s|<)/gi,
                '$2'
            ],

            'pussy': [
                /(\(@\))($|\s|<)/g,
                '$2'
            ],

            'rainbow': [
                /(\(R\))($|\s|<)/g,
                '$2'
            ],

            'smile': [
                /(:-?\))($|\s|<)/gi,
                '$2'
            ],

            'star': [
                /(\(\*\))($|\s|<)/g,
                 '$2'
            ],

            'stare': [
                /(:-?\|)($|\s|<)/gi,
                '$2'
            ],

            'thumbdown': [
                /(\(N\))($|\s|<)/g,
                 '$2'
            ],

            'thumbup': [
                /(\(Y\))($|\s|<)/g,
                '$2'
            ],

            'tongue': [
                /(:-?P)($|\s|<)/gi,
                 '$2'
            ],

            'unhappy': [
                /(:-?\()($|\s|<)/gi,
                '$2'
            ],

            'wink': [
                /(;-?\))($|\s|<)/gi,
                '$2'
            ]

        },

        'formatting': {
            'bold': [
                /(^|\s|>|\()((\*)([^<>'"\*]+)(\*))($|\s|<|\))/gi,
                '$1<b>$2</b>$6'
            ],

            'italic': [
                /(^|\s|>|\()((\/)([^<>'"\/]+)(\/))($|\s|<|\))/gi,
                '$1<em>$2</em>$6'
            ],

            'underline': [
                /(^|\s|>|\()((_)([^<>'"_]+)(_))($|\s|<|\))/gi,
                '$1<span style="text-decoration: underline;">$2</span>$6'
            ]
        }

    };


    /**
     * Generates a given emoticon HTML code
     * @public
     * @param {string} image
     * @param {string} text
     * @param {string} after
     * @return {string}
     */
    self.emoteImage = function(image, text, after) {

        try {
            return ' <img class="emoticon emoticon-' + image + ' smileys-images" alt="' + Common.encodeQuotes(text) + '" src="' + './images/others/blank.gif' + '" /> ' + after;
        } catch(e) {
            Console.error('Filter.emoteImage', e);
        }

    };


    /**
     * Filters a given message
     * @public
     * @param {string} message
     * @param {string} nick
     * @param {string} html_escape
     * @return {string}
     */
    self.message = function(message, nick, html_escape) {

        try {
            var filtered = message;
            
            // We encode the HTML special chars
            if(html_escape) {
                filtered = filtered.htmlEnc();
            }
            
            // /me command
            filtered = filtered.replace(self.message_regex.commands.me, nick + ' $7')
            
            // We replace the smilies text into images
            var cur_emote;

            for(var e in self.message_regex.emotes) {
                cur_emote = self.message_regex.emotes[e];

                filtered = filtered.replace(
                    cur_emote[0],
                    self.emoteImage(
                        e,
                        '$1',
                        cur_emote[1]
                    )
                );
            }
            
            // Text formatting
            var cur_formatting;

            for(var f in self.message_regex.formatting) {
                cur_formatting = self.message_regex.formatting[f];

                filtered = filtered.replace(
                    cur_formatting[0],
                    cur_formatting[1]
                );
            }

            // Add the links
            if(html_escape) {
                filtered = Links.apply(filtered, 'desktop');
            }
            
            // Filter integratebox links
            filtered = IntegrateBox.filter(filtered);
            
            return filtered;
        } catch(e) {
            Console.error('Filter.message', e);
        }

    };


    /**
     * Filters a xHTML message to be displayed in Jappix
     * @public
     * @param {string} code
     * @return {string}
     */
    self.xhtml = function(code) {

        try {
            // Allowed elements array
            var elements = [
                'a',
                'abbr',
                'acronym',
                'address',
                'blockquote',
                'body',
                'br',
                'cite',
                'code',
                'dd',
                'dfn',
                'div',
                'dt',
                'em',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'head',
                'html',
                'kbd',
                'li',
                'ol',
                'p',
                'pre',
                'q',
                'samp',
                'span',
                'strong',
                'title',
                'ul',
                'var'
            ];
            
            // Allowed attributes array
            var attributes = [
               'accesskey',
               'alt',
               'charset',
               'cite',
               'class',
               'height',
               'href',
               'hreflang',
               'id',
               'longdesc',
               'profile',
               'rel',
               'rev',
               'src',
               'style',
               'tabindex',
               'title',
               'type',
               'uri',
               'version',
               'width',
               'xml:lang',
               'xmlns'
            ];
            
            // Check if Filter for XHTML-IM images is enabled
            if(DataStore.getDB(Connection.desktop_hash, 'options', 'no-xhtml-images') != '1') {
                elements.push("img");
            }
            
            // Remove forbidden elements
            $(code).find('html body *').each(function() {
                // This element is not authorized
                if(!Utils.existArrayValue(elements, (this).nodeName.toLowerCase())) {
                    $(this).remove();
                }
            });
            
            // Remove forbidden attributes
            $(code).find('html body *').each(function() {
                // Put a pointer on this element (jQuery way & normal way)
                var cSelector = $(this);
                var cElement = (this);
                
                // Loop the attributes of the current element
                $(cElement.attributes).each(function(index) {
                    // Read the current attribute
                    var cAttr = cElement.attributes[index];
                    var cName = cAttr.name;
                    var cVal = cAttr.value;
                    
                    // This attribute is not authorized, or contains JS code
                    if(!Utils.existArrayValue(attributes, cName.toLowerCase()) || ((cVal.toLowerCase()).match(/(^|"|')javascript:/))) {
                        cSelector.removeAttr(cName);
                    }
                });
            });
            
            // Filter some other elements
            $(code).find('a').attr('target', '_blank');
            
            return $(code).find('html body').html();
        } catch(e) {
            Console.error('Filter.xhtml', e);
        }

    };


    /**
     * Return class scope
     */
    return self;

})();