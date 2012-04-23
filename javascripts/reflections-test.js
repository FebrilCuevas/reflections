jQuery( function(){

	jQuery(document).delegate('body', 'keyup', function(e){
		try{
			switch( e.which ){
				case 32: // spacebar
				case 39: // right key
					e.preventDefault();
					
					jQuery('img').reflectImages({ 
						'delay': 0, 
						'rotation' : 45, 
						'opacity' : 0.4, 
						'stripAllButImages' : true,
						'ensureMinNumberOfImages' : 24
						}
					);
					break;
				case 37: // left key
					jQuery('li img').reflectImages({'destroy' : true });
					break;
			}
		}
		catch(e){
			// nothing
		}
	});
	

	// for auto testing
	// setTimeout( function(){
	// 	jQuery('li img').reflectImages();
	// }, 500);
	// 
	// setTimeout( function(){
	// 	jQuery('li img').reflectImages({'destroy' : true });
	// }, 3000);
	
});