
var currentImage=0;
var numImages=0;
var listDefaultImgs=[  "media/ConceptLightF.png","media/exterior.jpg","media/r1.jpg","media/Relight1.jpg","media/cr4.png","media/r2.jpg","media/r3.jpg","media/r4.jpg"];
function Init ()
{
	SliderHTML();
	startSlider();
	$('.navMenuContainer').fadeIn(2000).css("display","flex");
	$('.content').fadeIn(2000);
	
	//SetMenuActions();	


}
 function startAudio()
 {
 	var audio = document.getElementById("audio")
	audio.play();
 }
//Creamos el slider utilizando las imágenes que se encuentran dentro del array
function SliderHTML()
{
	
	var currentDefImage=0;
	var totalDefImgs = this.listDefaultImgs.length;
	this.numImages = this.listDefaultImgs.length;
	
	var newHTML="";
	
	// 	for(let i=0;i< totalDefImgs;i++)
	// {

		newHTML += '<div class="imgItem" id= "fotillo" style="display:none">';
	
		newHTML+='</div>';
		++currentDefImage;
		
	// }

	$("#Relight").html(newHTML);

	// for(let i=0;i< totalDefImgs;i++)
	// {

	// 	$("#img"+currentDefImage+"").css("background-image","url("+listDefaultImgs[currentDefImage]+")");
		
	// }


};

//Anima los contenedores de las imagenes para que parezca una "cinta"
function startSlider()
{
	var This= this;

	$("#fotillo").fadeIn(2000).css("background-image","url("+This.listDefaultImgs[This.currentImage]+")").delay(1000).fadeOut(2000);
	++This.currentImage;
	setInterval(function ()
	{
			console.log(This.numImages)
			console.log(This.currentImage)
		

		// if(This.currentImage == 0)
		// 	$("#img"+(This.numImages-1)+"").fadeOut(500);
		// else
		// 	$("#img"+(This.currentImage-1)+"").fadeOut(500);


		
		// $("#img"+This.currentImage+"").css("background-image","url("+listDefaultImgs[This.currentImage]+")");
		// $("#img"+This.currentImage+"").fadeIn(2000);
		$("#fotillo").fadeIn(2000).css("background-image","url("+This.listDefaultImgs[This.currentImage]+")").delay(500).fadeOut(2000)
		console.log($(".imgItem").css("background-image"));
		++This.currentImage;

		if(This.currentImage >= This.numImages)
			This.currentImage = 0;

		

		

	}, 5000);	
};

//Da los comportamientos correspondientes al menú
function SetMenuActions ()
{
	
	$(".itemMenu").on('click', function(event)
	{
	    console.log(event);
	    var id = event.currentTarget.attributes[1].value;
	    var target = $('#'+id);	    
	    if( target.length )
	    {
		event.preventDefault();
		$('html, body').stop().animate({
		    scrollTop: target.offset().top
		}, 1000);
	    }
	});
	$(".ItemGallery").on('click', function(event)
	{
		if($(this).hasClass("ItemGalleryClick"))
			$(this).removeClass("ItemGalleryClick");
		else
			$(this).addClass("ItemGalleryClick");
	})


}
