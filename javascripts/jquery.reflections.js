/*
The MIT License

Copyright (c) 2011 Dominick Guzzo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
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
		// TODO: delay turned off right now because it doesn't work with dynamic masonry as a result of stripping all but images 
		if ( false && options.delay ){ 
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
	
	// clone and append extra images if necessary
	function ensureMinNumberOfImages(minImages){
		if( isNaN(minImages) ){
			throw new Error('ensureMinNumberOfImages() called with invalid argument; should be a valid number');
		}
		
		var $images = jQuery('img'), numImagesToClone, $imagesToClone, imagesOnPage = $images.length;
		
		while ( imagesOnPage < minImages ){
			numImagesToClone = minImages - imagesOnPage;
			console.log("we've got a problem; we're short by " + numImagesToClone + " images. going to clone some." );
			
			$imagesToClone = jQuery('img:lt(' + numImagesToClone + ')');
			jQuery('body').append($imagesToClone.clone().addClass('reflectionsClonedImage')); // class is just for record-keeping's sake
			imagesOnPage += $imagesToClone.length;
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
	
	// removes everything from the document except for image elements
	function removeAllButImages(){
		console.log('removeAllButImages');
		var $images = jQuery('body img');
		$images = $images.clone();
		jQuery( 'body *' ).remove();
		jQuery('body').append($images);
		jQuery(window).scrollTop(0);
	}
	
	// run the masonry pluging to get images all nice and laid out aesthetically
	function runMasonry(){
		
		if ( typeof jQuery.fn.masonry === 'function' ){
			jQuery('body').masonry({
				itemSelector : '.reflectionsWrapper',
				columnWidth : 260,
				isFitWidth: true
			});
			masonryRun = true;
		}
		else{
			throw new Error('jquery.masonry is not loaded');
		}
	}
	
	$.fn.reflectImages = function(options){
		var defaults = { 
			'rotation' : 45, 
			'opacity' : 0.5, 
			'stripAllButImages' : false,
			'removeSmallImages' : { 'minDimension' : 90, 'maxDimension' : 370 },
			'overflowHidden' : true,
			'removeAnimatedGifs' : false,
			'ensureMinNumberOfImages' : null,
			'skipMasonry' : false
		}, 
		item = null,
		options = options || {};

		if( console ){console.log('running reflectImages()...');}

		options = $.extend(defaults, options);
		
		// currently out of commission...
		if( options.delay ){
			var waitTime = 0; // just init this here; it'll be a counter
		}
		
		if( options.removeAnimatedGifs ){
			jQuery('img[src$=gif]').remove(); // won't be able to tell if they're animated or not, so just remove all GIFs
		}
		
		// really small images could end up not looking that good, so give user the option to filter them out
		if ( options.removeSmallImages ){
			var $images = jQuery('img'), $image;
			
			$images.each(function(index) {
			  $image = jQuery(this);
				if ( $image.width() < options.removeSmallImages.minDimension || $image.height() < options.removeSmallImages.minDimension ){
					console.log('removing small image: ' + $image.attr('src') );
					$image.remove();
				}
				if ( $image.width() > options.removeSmallImages.maxDimension ){
					console.log('resizing large image: ' + $image.attr('src') );
					$image.attr('height', ''); // height will be automatically interpreted by the browser to preserve aspect ratio (this is not as good as figuring out the new height and setting it explicitly, but page performance doesn't really matter at this point)
					$image.attr('width', options.removeSmallImages.maxDimension );
				}
				else if ( $image.height() > options.removeSmallImages.maxDimension ){
					console.log('resizing large image: ' + $image.attr('src') );
					$image.attr('width', '');
					$image.attr('height', options.removeSmallImages.maxDimension );
				}
			})
		}
		
		// if a page only has a small amount of images, it may not fill up the screen after the reflections are run, which has an
		// underwhelming effect. in this case, we should clone existing images to fill up the space.
		if( options.ensureMinNumberOfImages ){
			ensureMinNumberOfImages(options.ensureMinNumberOfImages);
			jQuery('img').reflectImages(jQuery.extend(true, {}, options, {'ensureMinNumberOfImages' : false}));
			return;
		}
		
		// take all content out of the body except for image elements. this makes the result more "static" in that it's free of annoying hyperlinks or stying
		if( options.stripAllButImages ){
			removeAllButImages();
			
			jQuery('img').reflectImages(jQuery.extend(true, {}, options, {'stripAllButImages' : false}));
			
			// leave things in place if run a second time because it starts to get hairy when masonry is run again
			if( !options.skipMasonry && !masonryRun ){
				runMasonry();
			}
			return;
		}
		
		// run the meat of the plugin on each matched element (should be <img>'s)
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
		
		// by default, hide overflow so that the blended result of the images is only one screen's worth
		if( options.overflowHidden ){
			jQuery('html').css('overflow', 'hidden');
		}
		
		// due to the masonry plugin and nature of floated images, the body will end up being less than the full width of the page, 
		// leaving whitespace (or whatever the background color is for the page the plugin is being run on), so this styling will fix that.
		jQuery('body').css( 'margin', "0 auto" );
		jQuery('html').css( 'background', 'black');
		
	}; // end $.fn.reflectImages
})(jQuery);

