javascript:
delete jQuery; 
var jQueryAppended = false, masonryAppended = false, reflectAppended = false, timeout = 250;
console.log('appending jquery 1.7.1');
var scriptElem = document.createElement('script');
scriptElem.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
document.getElementsByTagName('head')[0].appendChild(scriptElem);

(function ensureJQueryLoaded() {
	
	if (typeof jQuery === "function") {
		
		jQuery('body *').css('visibility', 'hidden');
		jQuery('body').prepend('<img id="tempAjaxLoader" style="display: block; width: 76px; margin: 0 auto;" src="http://www.telecommutetojuryduty.com/images/ajax_loader_76.gif" width="76" height="76">');
		
		if ( !masonryAppended ){
			console.log('appending masonry plugin');
			scriptElem = document.createElement('script');
			scriptElem.src = 'http://www.telecommutetojuryduty.com/scripts/external/jquery.masonry.min.js';
			document.getElementsByTagName('head')[0].appendChild(scriptElem);
			
			console.log('appending reflections stylesheet');
			var styleElem = document.createElement('link');
			styleElem.href = 'http://www.telecommutetojuryduty.com/misc/reflections/stylesheets/reflections.css';
			styleElem.rel = 'stylesheet';
			styleElem.type = 'text/css';
			document.getElementsByTagName('head')[0].appendChild(styleElem);
			masonryAppended = true;
		}
		
		(function ensureMasonryLoaded() {
			
		    if (typeof jQuery.fn.masonry === 'function') {
			
					if( !reflectAppended ){
						console.log('appending reflections');
						scriptElem = document.createElement('script');
						scriptElem.src = 'https://raw.github.com/dguzzo/reflections/master/javascripts/jquery.reflections.js';
						document.getElementsByTagName('head')[0].appendChild(scriptElem);
						reflectAppended = true;
					}
				
	        (function ensureReflectLoaded() {

						if ( typeof jQuery.fn.reflectImages === 'function' ) {
							jQuery('img').reflectImages({
								'rotation': 45,
								'opacity': 0.4,
								'stripAllButImages': true,
								'removeAnimatedGifs': true,
								'ensureMinNumberOfImages' : 20
							});
							
							jQuery('#tempAjaxLoader').remove();
							jQuery('body').css('opacity', '0');
							jQuery('body *').css('visibility', 'visible');
							jQuery('body').fadeTo( 400, 1 );
						}
						else{
							setTimeout(function() {
								ensureReflectLoaded();
							},
							timeout);
						}
					})();
		    }
				else {
					setTimeout(function() {
						console.log('ensureMasonryLoaded timeout');
						ensureMasonryLoaded();
					},
					timeout);
		    }
		})();
	}
	else{
		setTimeout(function() {
    	ensureJQueryLoaded();
    },
    timeout);
	}
})();


