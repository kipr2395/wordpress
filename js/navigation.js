// /**
//  * File navigation.js.
//  *
//  * Handles toggling the navigation menu for small screens and enables TAB key
//  * navigation support for dropdown menus.
//  */
// ( function() {
// 	var container, button, menu, links, i, len;

// 	container = document.getElementById( 'site-navigation' );
// 	if ( ! container ) {
// 		return;
// 	}

// 	button = container.getElementsByTagName( 'button' )[0];
// 	if ( 'undefined' === typeof button ) {
// 		return;
// 	}

// 	menu = container.getElementsByTagName( 'ul' )[0];

// 	// Hide menu toggle button if menu is empty and return early.
// 	if ( 'undefined' === typeof menu ) {
// 		button.style.display = 'none';
// 		return;
// 	}

// 	menu.setAttribute( 'aria-expanded', 'false' );
// 	if ( -1 === menu.className.indexOf( 'nav-menu' ) ) {
// 		menu.className += ' nav-menu';
// 	}

// 	button.onclick = function() {
// 		if ( -1 !== container.className.indexOf( 'toggled' ) ) {
// 			container.className = container.className.replace( ' toggled', '' );
// 			button.setAttribute( 'aria-expanded', 'false' );
// 			menu.setAttribute( 'aria-expanded', 'false' );
// 		} else {
// 			container.className += ' toggled';
// 			button.setAttribute( 'aria-expanded', 'true' );
// 			menu.setAttribute( 'aria-expanded', 'true' );
// 		}
// 	};

// 	// Get all the link elements within the menu.
// 	links    = menu.getElementsByTagName( 'a' );

// 	// Each time a menu link is focused or blurred, toggle focus.
// 	for ( i = 0, len = links.length; i < len; i++ ) {
// 		links[i].addEventListener( 'focus', toggleFocus, true );
// 		links[i].addEventListener( 'blur', toggleFocus, true );
// 	}

// 	/**
// 	 * Sets or removes .focus class on an element.
// 	 */
// 	function toggleFocus() {
// 		var self = this;

// 		// Move up through the ancestors of the current link until we hit .nav-menu.
// 		while ( -1 === self.className.indexOf( 'nav-menu' ) ) {

// 			// On li elements toggle the class .focus.
// 			if ( 'li' === self.tagName.toLowerCase() ) {
// 				if ( -1 !== self.className.indexOf( 'focus' ) ) {
// 					self.className = self.className.replace( ' focus', '' );
// 				} else {
// 					self.className += ' focus';
// 				}
// 			}

// 			self = self.parentElement;
// 		}
// 	}

// 	/**
// 	 * Toggles `focus` class to allow submenu access on tablets.
// 	 */
// 	( function( container ) {
// 		var touchStartFn, i,
// 			parentLink = container.querySelectorAll( '.menu-item-has-children > a, .page_item_has_children > a' );

// 		if ( 'ontouchstart' in window ) {
// 			touchStartFn = function( e ) {
// 				var menuItem = this.parentNode, i;

// 				if ( ! menuItem.classList.contains( 'focus' ) ) {
// 					e.preventDefault();
// 					for ( i = 0; i < menuItem.parentNode.children.length; ++i ) {
// 						if ( menuItem === menuItem.parentNode.children[i] ) {
// 							continue;
// 						}
// 						menuItem.parentNode.children[i].classList.remove( 'focus' );
// 					}
// 					menuItem.classList.add( 'focus' );
// 				} else {
// 					menuItem.classList.remove( 'focus' );
// 				}
// 			};

// 			for ( i = 0; i < parentLink.length; ++i ) {
// 				parentLink[i].addEventListener( 'touchstart', touchStartFn, false );
// 			}
// 		}
// 	}( container ) );
// } )();


(function( $ ) {
	var masthead, menuToggle, siteNavContain, siteNavigation;

	function initMainNavigation( container ) {

		// Add dropdown toggle that displays child menu items.
		var dropdownToggle = $( '<button />', { 'class': 'dropdown-toggle', 'aria-expanded': false })
			.append( $( '<span />', { 'class': 'dropdown-symbol', text: '+' }) )
			.append( $( '<span />', { 'class': 'screen-reader-text', text: kimsdopeScreenReaderText.expand }) );

		container.find( '.menu-item-has-children > a, .page_item_has_children > a' ).after( dropdownToggle );



		container.find( '.dropdown-toggle' ).click( function( e ) {
			var _this = $( this ),
				screenReaderSpan = _this.find( '.screen-reader-text' );
				dropdownSymbol = _this.find( '.dropdown-symbol');
				dropdownSymbol.text( dropdownSymbol.text() === '-' ? '+' : '-');

			e.preventDefault();
			_this.toggleClass( 'toggled-on' );
			_this.next( '.children, .sub-menu' ).toggleClass( 'toggled-on' );

			_this.attr( 'aria-expanded', _this.attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );

			screenReaderSpan.text( screenReaderSpan.text() === kimsdopeScreenReaderText.expand ? kimsdopeScreenReaderText.collapse : kimsdopeScreenReaderText.expand );
		});
	}

	initMainNavigation( $( '.main-navigation' ) );

	masthead       = $( '#masthead' );
	menuToggle     = masthead.find( '.menu-toggle' );
	siteNavContain = masthead.find( '.main-navigation' );
	siteNavigation = masthead.find( '.main-navigation > div > ul' );

	// Enable menuToggle.
	(function() {

		// Return early if menuToggle is missing.
		if ( ! menuToggle.length ) {
			return;
		}

		// Add an initial value for the attribute.
		menuToggle.attr( 'aria-expanded', 'false' );

		menuToggle.on( 'click.kimsdope', function() {
			siteNavContain.toggleClass( 'toggled-on' );

			$( this ).attr( 'aria-expanded', siteNavContain.hasClass( 'toggled-on' ) );
		});
	})();

	// Fix sub-menus for touch devices and better focus for hidden submenu items for accessibility.
	(function() {
		if ( ! siteNavigation.length || ! siteNavigation.children().length ) {
			return;
		}

		// Toggle `focus` class to allow submenu access on tablets.
		function toggleFocusClassTouchScreen() {
			if ( 'none' === $( '.menu-toggle' ).css( 'display' ) ) {

				$( document.body ).on( 'touchstart.kimsdope', function( e ) {
					if ( ! $( e.target ).closest( '.main-navigation li' ).length ) {
						$( '.main-navigation li' ).removeClass( 'focus' );
					}
				});

				siteNavigation.find( '.menu-item-has-children > a, .page_item_has_children > a' )
					.on( 'touchstart.kimsdope', function( e ) {
						var el = $( this ).parent( 'li' );

						if ( ! el.hasClass( 'focus' ) ) {
							e.preventDefault();
							el.toggleClass( 'focus' );
							el.siblings( '.focus' ).removeClass( 'focus' );
						}
					});

			} else {
				siteNavigation.find( '.menu-item-has-children > a, .page_item_has_children > a' ).unbind( 'touchstart.kimsdope' );
			}
		}

		if ( 'ontouchstart' in window ) {
			$( window ).on( 'resize.kimsdope', toggleFocusClassTouchScreen );
			toggleFocusClassTouchScreen();
		}

		siteNavigation.find( 'a' ).on( 'focus.kimsdope blur.kimsdope', function() {
			$( this ).parents( '.menu-item, .page_item' ).toggleClass( 'focus' );
		});
	})();
})( jQuery );
