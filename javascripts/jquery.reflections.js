/*!
 * reflect-images
 *   http://www.telecommutetojuryduty.com/
 *
 * Copyright (c) 2011 D.Guzzo (http://www.telecommutetojuryduty.com/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Built on top of the jQuery library
 *   http://jquery.com
 *
 */

(function($){
	
	// todo: add ability to strip page of all but image elements.having them floated neaby each other to get the best final result
	// after the plugin's main function runs. also maybe could load in masonry and make bricks outta them first, but that's a bit 
	// more ambitious
	
	var masonryRun = false;
	
	function wrapImage(options){

		var $image = jQuery(this),
			width = this.width,
			height = this.height,
			options = jQuery.extend(true, {}, options);
			
		// if we want delay so that we can see the reflection happening incrementally
		if ( options.delay ){
			setTimeout( function(){
				wrapImageInternal(options);
			}, options.delaySpecific);
		}
		else{
			wrapImageInternal(options);
		}
		
		// the meat of the process
		function wrapImageInternal(options){
			$image.wrap('<div class="reflectionsWrapper"></div>')
				.after('<div class="reflection top" style="top: -'+height+'px"></div>')
				.after('<div class="reflection right" style="right: -'+width+'px"></div>')
				.after('<div class="reflection bottom" style="bottom: -'+height+'px"></div>')
				.after('<div class="reflection left" style="left: -'+width+'px"></div>');
			
			var $reflections = $image.closest('.reflectionsWrapper').find('.reflection');
				
			$reflections.append($image.clone()); // put images into each of the four reflection containers
			$reflections.css('opacity', options.opacity );
			
			// have some fun:
			$image.closest('.reflectionsWrapper').css('-webkit-transform', 'rotate('+options.rotation+'deg)');
		}
		
	}
	
	// set things back to the way they were before the plugin was run
	function destroyReflection(){
		console.log('destroyReflection');
		
		var wrapperSelector = '.reflectionsWrapper',
			$wrapper = jQuery(this).closest(wrapperSelector);

		if( $wrapper.length > 0 ){
			$wrapper.find('.reflection').remove();
			jQuery(this).unwrap(wrapperSelector);
			jQuery('html').css('overflow', 'auto');
		}
	}
	
	function removeAllButImages(){
		console.log('removeAllButImages');
		var $images = jQuery('body img');
		$images = $images.clone();
		jQuery( 'body *' ).remove();
		jQuery('body').append($images);
		jQuery(window).scrollTop(0);
	}
	
	
	$.fn.reflectImages = function(options){
		var defaults = { 
			'rotation' : 45, 
			'opacity' : 0.5, 
			'destroyAllButImages' : false,
			'overflowHidden' : true
		}, 
		item = null,
		options = options || {};

		// todo to flesh out this plugin, other parameterized things (rotation, opacity, etc).
		options = $.extend(defaults, options);
		
		if( options.delay ){
			var waitTime = 0;
		}
		
		if( options.stripAllButImages ){
			removeAllButImages();
			
			jQuery('img').reflectImages(jQuery.extend(true, {}, options, {'stripAllButImages' : false}));
			
			jQuery('.reflectionsWrapper').css('float', 'left');
			
			// leave things in place if run a second time
			if( !masonryRun ){
				jQuery('body').masonry({
					itemSelector : '.reflectionsWrapper',
					columnWidth : 260,
					isFitWidth: true
				});
			}
			
			masonryRun = true;
			
			return;
		}
		
		this.each( function(){
			
			item = this;
			
			if( options.destroy ){
				destroyReflection.call(item);
				return;
			}
			else{
				if( options.delay ){
					options.delaySpecific = waitTime;
					waitTime += options.delay; // need to tell the internal functions how much time to wait
				}
				wrapImage.call(item, options);
			}
		});
		
		if( options.overflowHidden ){
			jQuery('html').css('overflow', 'hidden');
		}
		
	}; // end $.fn.reflectImages
		
})(jQuery);

