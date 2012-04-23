javascript: 
var masonryAppended = false, reflectAppended = false, timeout = 250;
console.log('appending jquery');
var scriptElem = document.createElement('script');
scriptElem.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
document.getElementsByTagName('head')[0].appendChild(scriptElem);

(function ensureJQueryLoaded() {
	if (typeof jQuery === "function") {
		
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


