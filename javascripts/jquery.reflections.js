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
			$image.wrap('<div class="imageWrapper"></div>')
				.after('<div class="reflection top" style="top: -'+height+'px"></div>')
				.after('<div class="reflection right" style="right: -'+width+'px"></div>')
				.after('<div class="reflection bottom" style="bottom: -'+height+'px"></div>')
				.after('<div class="reflection left" style="left: -'+width+'px"></div>');
			
			var $reflections = $image.closest('.imageWrapper').find('.reflection');
				
			$reflections.append($image.clone()); // put images into each of the four reflection containers
			$reflections.css('opacity', options.opacity );
			
			// have some fun:
			$image.closest('.imageWrapper').css('-webkit-transform', 'rotate('+options.rotation+'deg)');

			jQuery('html').css('overflow', 'hidden');
			
			if (options.stripLinks ){
				var $link = $image.closest('a'),
					$linkChildren = $link.children();
				
				$link.replaceWith($linkChildren);
			}
			
		}
		
	}
	
	// set things back to the way they were before the plugin was run
	function destroyReflection(){
		console.log('destroyReflection');
		jQuery(this).siblings('div').remove();
		jQuery(this).unwrap('.imageWrapper');
		jQuery('html').css('overflow', 'auto');
	}
	
	$.fn.reflectImages = function(options){
		var defaults = { 
			'rotation' : 45, 
			'opacity' : 0.5, 
			'stripLinks' : false,
			'destroyAllButImages' : false // todo
		}, 
		item = null;

		// todo to flesh out this plugin, other parameterized things (rotation, opacity, etc).
		if (options) {
			$.extend(defaults, options);
		}
		
		if( defaults.delay ){
			var waitTime = 0;
		}
		
		this.each( function(){
			
			item = this;
			
			if( defaults.destroy ){
				destroyReflection.call(item);
				return;
			}
			else{
				if( defaults.delay ){
					defaults.delaySpecific = waitTime;
					waitTime += defaults.delay; // need to tell the internal functions how much time to wait
				}
				wrapImage.call(item, defaults);
			}
		});
		
	};
		
})(jQuery);

