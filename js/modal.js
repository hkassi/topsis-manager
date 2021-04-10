
/*-----------------------------------------------------------*/
/////******************/     Modal   /*******************/////







    /*-----------------------------------------------------------------*/
   //  this function injects the value positive or negative into the  //
  //  impact input in the modal form                                 //
 //                                                                //
/*----------------------------------------------------------------*/
let toggleCheck = function(id){
  let elt= document.getElementById("chk");
  elt.value = elt.checked?"positive":"negative";

}

    /*-----------------------------------------------------------*/
   // 	this is our costumized modal designed perfectly for our  //
  //	little application, however it just handles the input  	 //
 //                                                           //
/*-----------------------------------------------------------*/

class Modal{
  constructor(t="untitled", s=[],toggles=[]){
 		// here is where the modal saves the output and also if we're trying 
		// to edit an old row we pass the old data trough this 
    this.values = null; 
		// let's give our modal a title ( isn't that fancy lol)
    this.title = t;
		// and here we spicify exactly what we want (I am just talking about the input in the form :)) 
    this.specs = s;
		// in case some of them are toggles we duplicate it here 
    this.toggles = toggles;
  }
	// getters as usual 
  get getValues(){return this.values;}
  get getTitle(){return this.title;}
  get getSpecs(){return this.specs;}
  get getToggles(){ return this.toggles;}

	// and setters !!!
  set setValues(v){ this.values = v;}
  set setTitle(t){ this.title = t;}
  set setSpecs(s){ this.specs = s;}
  set setToggles(t){ this.toggles = t;}

	// this handle the visibility of the modal
  modalShow=function(){
		// hide that show that that's all 
    document.getElementById("modal").style.display ="block";
    document.getElementById("container").style.visibility = "hidden"; 
    document.getElementById("sidebar").style.visibility = "hidden"; 
		// costumize a little 
    document.getElementById("modalTitle").innerHTML = this.getTitle;
    document.getElementById("modalContent").innerHTML = this.modalForm();

		// bring the key board the game 
		// and assign enter keypress event to the modal confirm
    // Number 13 is the "Enter" key on the keyboard
    document.getElementById("modalForm").addEventListener("keyup", (event)=>{  
             if (event.keyCode === 13) { 
									// we cancel any default action  if there's any 
                   event.preventDefault();
                  // Tcouple the modal button element with a click
                 	document.getElementById("okBtn").click();
              }
    }); 

  }
	// this function is kindda the actual factory of the form 
  modalForm(){
		// let's prepare our data
    let specs= this.getSpecs;
		// (I hate using only letters as variables but let's break the rules for once ! it won't hurt ;) )  
    let l=specs.length;
    let values= this.getValues;
    let t_list = this.getToggles; 
		// in case we actualy have nothing!  let's give the modal nothing as in "" to loop over it (:))
    if(values == null) values = specs.map( spec => "");
		// this is the form var 
    let newForm = '<form id="modalForm" ">';
		// and here we loop over all the inputs 
    for(let i=0; i<l;i++){
				// if have a toggle 
        if(t_list.indexOf(specs[i])!= -1){  
						// then let's display a toggle 
            newForm += '<label>'+specs[i]+'</label><br>';
            
            newForm += '<label class="switch"><input type="checkbox" id="chk" onclick="toggleCheck()" value="positive" checked>';
            newForm += '<span  class="slider round"></span></label>';
        }else 
            newForm += '<label for="'+specs[i]+'">'+specs[i]+'</label><input type="text" value="'+values[i]+'"><br>';

    }
		// here we close the form  and return it 
    newForm += '</form>';
    return newForm;  
}
	// this methode saves the input into the instance of this class
  modalSave= function(){
		// let's locate the actual form in the html first
    let  items = document.getElementById("modalForm").elements;
		// and create a list for the outputs 
    let  formValues = [];
		// and finaly push them into that list 
    for(let index = 0; index < items.length; index++){
         formValues.push(items[index].value);
    }
		// and save it 
    this.setValues = formValues;
		// then say goodbuy 
    this.modalEXit();
  }

	// this our little methode has the role of doing nothing but canceling  
  modalCancel(){
		// save nothing
    this.setValues = null;
		// and exit 
    this.modalEXit();
  }
	// this methode does the show and makes our modal disappear (with one finger snap lol) 
  modalEXit(){
    document.getElementById("modal").style.display ="none";
    document.getElementById("container").style.visibility = "visible"; 
    document.getElementById("sidebar").style.visibility = "visible"; 
  }

}
// the end 

