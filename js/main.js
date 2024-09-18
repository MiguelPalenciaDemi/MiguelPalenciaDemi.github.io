const sectionNames = ["start","about","main_projects","projects"];
var currentScroll = sectionNames[0];

function setSocial(name, link)
{
  
  let social = $("#"+name);
  social.css("background-image", 'url(./media/'+name+'.svg)');
  social.attr('href', link);

}

function setNavigation(name)
{  
  let navigation = $("#"+name+"_bt");
  navigation.click(function (e) 
  {       
     let element = document.getElementById(name);
     element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
   
  });
}



//Mejorar
function calculateSectionPosition()
{
  let scroll = $(window).scrollTop();
  let start = $("#start");
  let about = $("#about");
  let main_projects = $("#main_projects");
  let projects = $("#projects");

  if(scroll > about.position().top-5 && scroll <= main_projects.position().top-5)
    {
      $("#"+currentScroll+"_bt").removeClass("selected");
      currentScroll = "about";
      $("#"+currentScroll+"_bt").addClass("selected");
      
      
    }
  else if(scroll > main_projects.position().top-5 && scroll <= projects.position().top-5)
    {
      $("#"+currentScroll+"_bt").removeClass("selected");      
      currentScroll = "main_projects";
      $("#"+currentScroll+"_bt").addClass("selected");
    }
  else if(scroll > projects.position().top-5 && currentScroll)
    {
      $("#"+currentScroll+"_bt").removeClass("selected");
      currentScroll = "projects";      
      $("#"+currentScroll+"_bt").addClass("selected");
    }
  else
  {
    $("#"+currentScroll+"_bt").removeClass("selected");
    currentScroll = "start";
    $("#"+currentScroll+"_bt").addClass("selected");
  }
    
}


$(document).ready(function()
{  

  setSocial("linkedin","https://www.linkedin.com/in/miguel-palenciadm/");
  setSocial("twitter", "https://x.com/MiguelPalenciaD");  
  setSocial("itch","https://miguelpalenciademi.itch.io/");
  setSocial("mail","mailto:miguelpalenciademi@gmail.com");

  for(let index in sectionNames)
  {
    setNavigation(sectionNames[index]);
  }  

  
  $(window).scroll(function () 
  { 
    calculateSectionPosition();  
  });
  
});