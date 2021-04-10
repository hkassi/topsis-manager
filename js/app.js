
/*----------------------------------------------------------------------------------------*/
/////*************************/     App   /********************************************/////

// a state that indecates which table we're working on  (true if it's the criteria table  
let state = true;

// a modal that behaves like the input interface 
let modal = new Modal();

// two tables one holds the criteria the other holds the samples on which we're applying topsis 
let criteria = new Table();
let samples  = new Table();

// a header that handles the table header when it changes 
let header= new Header();

// set the initials 
header.setValues = ["Criteria name", "Criteria weight", "Criteria impact"];

// a flag to prevent mixing the output of topsis and the brute data 
let rankOn= false;

    /*-----------------------------------------------------------------------------------------*/
   //        this is a callback function that is invoked when we submit the values from       //
  //        the modal form  and it validates them before it sends them the table             //
 //                                                                                         //
/*----------------------------------------------------------------------------------------*/ 

let appConfirm=function(answer){
  // answer is true when the user clicked ok 
  if(answer){
    // save the input so that we can reach it later
    modal.modalSave();
    let values = modal.getValues;
    if(state){
      if(!isNumber(values[1]) || values[1]<=0){ // if the weight is not a number 
          appNotify("Weights must be a non negative number");
      }
      else {
        if (values[0]=="") 
              appNotify("criteria must be given a name");
        else {
            // create new row and save the values into it before adding it to the table
            // the first index matches the name
           criteria.tableAdd(values);
        }   
      }
    }else {
      // when it comes to the samples, their values must be all numbers except the first
      // map each value to true if it's a number
      let numbers = values.map(value => isNumber(value)); 
      numbers = numbers.slice(1,numbers.length); 
      // reduce the decision to one, true if the input is accepted 
      let ok = numbers.reduce((item,value)=> item && value, true);  
      if(ok){
          samples.tableAdd(values);
      }
      else appNotify(" Numeric values are required"); 
    }
  }
  modal.modalCancel();
}

    /*--------------------------------------------------------------------------------------------*/
   //  this is an the call back function  that handles any new input                             //
  //  and it customizes the modal with the title and toggle before it invokes it                //
 //                                                                                            //
/*--------------------------------------------------------------------------------------------*/

let appADD=function(){
  // get specifications we want to edit from the table header
  modal.setSpecs = header.getValues ; 
  // true if we dealing with criteria 
  if(state){ 
    modal.setTitle = "Add new criteria";
    // here we telling the modal that the input "Criteria impact" is actualy a toggle
    modal.setToggles = ["Criteria impact"];
    modal.modalShow();
  }
  else{
    modal.setTitle = "Add new sample";
    modal.modalShow();
  }
}


   /*--------------------------------------------------------------------------------------------*/
  // this is the callback function that deletes items from the table                            //
 //                                                                                            //
/*--------------------------------------------------------------------------------------------*/

let appDELETE=function(){
    // if no item is selected then no action is required 
    if(ISelection.length <1) {
      appNotify("please select items to delete");
      return;
    }
    // then if there is any we just tell the right table to handle that 
    if(state) criteria.tableDelete();
    else samples.tableDelete();
}


     /*-----------------------------------------------------------------------------------------------*/
    //  this is the call back function that handles the editing of the old data                       //
   //  it costumizes the modal before invoking it just like in appAdd except this time we inform     //
  //  the table that we're not intending to add new data we just updating the old ones              //
 //                                                                                                //
/*------------------------------------------------------------------------------------------------*/


let appEDIT=function(){
  // holds old data in vals var
  let vals;
  // get the specification from the current table header again
  modal.setSpecs = header.getValues; 
  // here we tell if there is only one item selected or many, if so, we proceed, otherwise we exit  
  if(ISelection.length != 1 )  {
    appNotify("Can't edit many rows at once");
    return;
  }
  else { 
      let item = ISelection[0];
      if(state) {
        // set the modal properties first
        modal.setTitle = "edit a criteria";
        modal.setToggles = ["Criteria impact"];
        // infor the table with the targeted row 
        criteria.setEditTarget = item;  
        // we need also the old data to show it before editing it 
        let old_row = criteria.getRows.filter(row => row.getId == item)[0]; 
        vals = old_row.getData;
      }
      else{
				if(rankOn) getRid();
        modal.setTitle = "edit a sample";
        samples.setEditTarget = item;  
        let old_row = samples.getRows.filter(row => row.getId == item)[0]; 
        vals = old_row.getData; 
      }  
      modal.setValues = vals;
      modal.modalShow();
  }
}


    /*--------------------------------------------------------------------------------------*/
   //  this is an other callback function, it helps to manage the tables when we switch    //
  //  between the two of them and it sets teh right header for each one of them           //
 //                                                                                      //
/*--------------------------------------------------------------------------------------*/


let appToggle=function(){
  // in case the current table is the one that holds the criteria 
  if(state){
    // refresh the table 
    let rows = criteria.getRows;
    let header_values = rows.map(row => row.getData[0]);
    // we can't switch if there is no criteria or there's only one 
    if(header_values.length <2) {
      appNotify("two criteria at least are required");
    }
    else{
      // here we start to switch to the table that holds samples 
      criteria.tableHide();
      samples.tableShow();
      document.getElementById("playBtn").style.display = "block";

      // set the header of the samples table
      // and add a title column
      header.setValues = ["Sample title"].concat(header_values);
      // refresh the header so that we can see the new one 
      header.hideHeader();
      header.showHeader();
      // and turn off the falg that indicates which is the current table
      state = false;
    }
  }
  else{
    // hide the button that launches topsis when we're back in the criteria table
    document.getElementById("playBtn").style.display = "none";
    // if we're back from the samples table and still contains the rank col 
    if(rankOn) getRid();
    // refresh the tables
    samples.tableHide();
    criteria.tableShow();
    // refresh the header
    header.setValues = ["Criteria name", "Criteria weight", "Criteria impact"];
    header.hideHeader();
    header.showHeader();
    // turn on the flag because we're back to criteria table
    state = true;

  }
}

   /*------------------------------------------------------------------------------------*/
  // A sample box that delivers the messages warnings and any kind of info to the user  //
 //                                                                                    //
/*------------------------------------------------------------------------------------*/

let appNotify=function(msg){
  document.getElementById("notification").style.display ="block";
  document.getElementById("notificationBody").innerHTML = msg;
}
let hideNotification=function(){ 
  document.getElementById("notification").style.display ="none";
}

   /*------------------------------------------------------------------------------------*/
  // few functions that come handy with the topsis function                             //
 //                                                                                    //
/*------------------------------------------------------------------------------------*/

let sliceColumn=function(Arr){
  // transpose it in order to gather all the first indexes in one array
  Arr = transpose(Arr);
  Arr = deleteFromArray(Arr, null,0);
  return transpose(Arr);
}

// this function gets gid of the rank column  
let getRid=function(){
      // remove the word rank from the header
      let h_values = header.getValues;
      h_values = deleteFromArray(h_values,null,0);
      // set the new vaues and refresh it
      header.setValues = h_values;
      header.hideHeader();
      header.showHeader();
      //  delete rank numbers from  each row
      let rows = samples.getRows ;
      rows.forEach( row =>{
        let vals = row.getData;
        // delete the rank and the sample title also 
        vals = deleteFromArray(vals,null,0);
        row.setData = vals;
        // refresh the row
        row.hideRow();
        row.showRow();
      });
      // turn off the flag 
      rankOn = false;
}


    /*--------------------------------------------------------------------------------*/
   //  this is the most important function, it's also a callback function            //
  //  it extract the data from the two tables and apply topsis on them              //
 //                                                                                //
/*--------------------------------------------------------------------------------*/

let runTopsis=function(){

  // get the decision matrix 
  //  there should be names for each row later
  let X=  samples.tableRenderArray();
  // check if there is enough data 
  if(X.length <2) appNotify("theresn't enought samples to run topsis");
  //get criteria 
  let C = criteria.tableRenderArray();
  // display result in the table
  // add the column rank to the header and showing it if it wasn't already there 
  let h_values = header.getValues;
  if(!rankOn)
  {
      // split the title column from the others  and save it 
      let titleCol = X[0];
      X= sliceColumn(X);
      // get the impacts of the criteria
      C = transpose(C);
      C[2] = C[2].map(item => (item == "positive")? true : false);
      // run topsis 
      let rank=(topsis(X,C[1],C[2])); 
      header.setValues = ["rank"].concat(h_values);
      //refresh the header
      header.hideHeader();
      header.showHeader();
      // attach ranks to the matrix
      let rows= samples.getRows;
      // couple each rank with the corresponding row and their title
      let couples = transpose([rank, titleCol, rows]);
      // then do the sort 
      couples = sortArray(couples);
      // split the rows from their rank
      couples = transpose(couples);
      titleCol = couples[1]
      rows = couples[2];
      // now add the rank values to each of them
      rows.forEach((row, index)=>{
        let new_data = [index].concat(row.getData);
        row.setData = new_data;
        // refresh it
        row.hideRow();
        row.showRow();
      });
      rankOn = true;
    }
    else getRid();
}



   /*--------------------------------------------------------------------------------------------*/
  //    this function is a callback that deals with opening files from the local storage        //
 //    and it updates the tables with new data                                                 //
/*--------------------------------------------------------------------------------------------*/


let appOpen=function(){
  // check if all the apis are availables for the operation 
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // we expecting a json type 
    let inputFile = document.getElementById('jsonFile');
    // here we receive the signal from the button 
    inputFile.click(); 
    // and we pass the task to the appLoad function 
    inputFile.oninput = appLoad;

  } else 
    appNotify('The File APIs are not supported in this browser.');
  
}

// this function opens a folder to select a file from it
let appLoad=function(){
   //  get the file refrence from the form 
   let inputFile = document.getElementById('jsonFile');
    // in case there is a problem 
   if (!inputFile) {
      appNotify("File not found");
    }else {
      // otherwise we just select a single file and deal with it
      let file = inputFile.files[0];
      let reader = new FileReader();
      reader.readAsText(file);
      // set the listner 
      reader.onload = (e)=>{ 
       // in order the make sure that the user has selected the appropriate file we use try-catch  
       try{
           // convert the json format to objects that JS understands 
          let  loaded_data = JSON.parse( e.target.result );
          appNotify("file has been uploaded succefuly");
          // in order not to mix stuff with each other we need to take a look at the current table  
          if(state){
             // if its the criteria table we start with it and switch to the samples table
             criteria.tableFromArray(loaded_data.criteria);
             appToggle();
             samples.tableFromArray(loaded_data.samples);
          }
          else{
             // and verse versa 
             samples.tableFromArray(loaded_data.samples);
             appToggle();
             criteria.tableFromArray(loaded_data.criteria);
          }
        }catch(e){
          appNotify("the file is damaged or not compatible with this application!");
        }

      }
    }
}


   /*---------------------------------------------------------------------------------------------*/
  //    this function saves the data in the two table ito the local storage, by downloading it   //
 //                                                                                             //
/*---------------------------------------------------------------------------------------------*/
let appSave=function(){
  // if the samples table still showing the rank let's get rid of it by simply trying toggling the table
  if(!state) appToggle();
  //  shaping the json format in which we want our data to take inside the file so that we can 
  //  retreive them easily later  

  let content = {"criteria": criteria.tableRenderArray(), "samples":samples.tableRenderArray()};
  // let's call it db.json (we might give that freedom to the user later but let's call it that for a moment)
  const filename='db.json';
  // kassi is the fake reference from where we got the file (happy to see my name there lol)
  const kassi = new Blob([JSON.stringify(content)], {type : 'application/json'});
  // we create a none visible link here
  const a = document.createElement('a');
  // that leads to our fake reference
  a.href= URL.createObjectURL(kassi);
  // and (boom lol) we dowload it 
  a.download = filename;
  a.click();
  // by simulating the click offcorse
  URL.revokeObjectURL(a.href);

}



   /*---------------------------------------------------------------------------------------------*/
  //    these functions toggles the visibily of the menu                                         //
 //                                                                                             //
/*---------------------------------------------------------------------------------------------*/
let showMenu=function(){
    document.getElementById("showIcon").style.display = "none";
    document.getElementById("hideIcon").style.display = "block";
    document.getElementById("sidebar").style.display = "block";
}
let hideMenu=function(){
    document.getElementById("sidebar").style.display = "none";
    document.getElementById("hideIcon").style.display = "none";
    document.getElementById("showIcon").style.display = "block";
}


    /*---------------------------------------------------------------------------------------------*/
   //    this callback function  creats an html link and activate it                              //
  //     IT WOULD APPRECIATE ANY KIND OF FEED BACK                                               //
 //      AND THANKS FOR ADVANCE                                                                 //
/*---------------------------------------------------------------------------------------------*/


let appContact=function(platform){
  let a = document.createElement('a');
  if(platform == "linkedin")
		a.href = "https://www.linkedin.com/in/hassankassi";
  else if(platform == "instagram")
		a.href = "https://www.instagram.com/kassiprog/";
  else if(platform=="gmail")
    a.href ="mailto:hassankassi93@gmail.com";
  else 
    a.href="https://github.com/kassi-prog";

  a.click();
}

   /*---------------------------------------------------------------------------------------------*/
  //    This guy down here  gets rid of the awsome welcome page and shows teh criteria table     //
 //                                                                                             //
/*---------------------------------------------------------------------------------------------*/
appStart=function(){
  document.getElementById("container").style.display ="block";
  document.getElementById("welcome").style.display ="none";

  criteria.tableShow();
}


//--------------------------------------------| THE END |-----------------------------------------------------//
