jQuery( function(){

	jQuery(document).delegate('body', 'keyup', function(e){
		try{
			switch( e.which ){
				case 39: // right key
					jQuery('li img').reflectImages({ 'delay': 80, 'rotation' : -130, 'opacity' : 0.4, 'stripLinks' : true });
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