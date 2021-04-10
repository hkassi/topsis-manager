//////////////-- header----//////////////////////////////////////////////////////////
let ISelection = []; // a list through which the table communicate selected items 
let isNumber=(number) =>(!isNaN(parseFloat(number)) && isFinite(number));
let deleteFromArray=function(Arr,item=null,i=-1){
    let index= (item != null) ? Arr.indexOf(item): i;
    if(item == null && index==-1){
      console.log("Item or Index has no match in the array ");
      return Arr;  // if the item doesn't exist let's return the same array at least
    }
    else {
      let head= Arr.slice(0,index);
      let tail= Arr.slice(index+1, Arr.length);
      return head.concat(tail);
    }
}
/*----------------------------------------------------------------------*/
/////**************************/     Table       /*******************/////

/*-------------------------------------------------------------- */
// this is the class that holds the structure of a row            //
//																															  //
/*----------------------------------------------------------------*/

class Row{
  constructor(rd=[],id){
		// we need a feild for our cells 
    this.data        = rd;		
		// and an id that holds their reference in the html skelleton  
		// so we can manipulate them the way want 
    this.id          = id;
  }
	// eventualy here are the getters 
  get getData(){ return this.data;}
  get getId(){ return this.id;}
	// and the setters 
  set setData(d){ this.data = d;}

	// tricky word but hiding a row means removing the html elements
  hideRow(){
    document.getElementById(this.getId).remove();
  }
	// this method creates the html elemnts and styles them
  showRow(){
			// the only table we have !!!!!!!
      let table = document.getElementById("table");
			// we create an actual html element
      let row   = table.insertRow();
			// retreive the data from the row property
      let cells = this.getData;
			// then inserting cell by cell
      cells.forEach( cell =>  row.insertCell().innerHTML = cell);
			// we also give the elemnt the same id
      row.setAttribute("id", this.id);
			// "this" is an awkward keyword in JAVASCRIPT let's get it out of the onclick function 
      let key = this.id;
			// here's the onclick event for the current row 
      row.onclick = function(){
				// get the stack that contains selected items and check if this id is already there 
        let clicked = (ISelection.indexOf(key) == -1)? true:false;
				// if so !!
        if(clicked){
      		  // change the style of the element into an inset shadow and italic bold font (GREAT HAE :) )
            document.getElementById(key).style.fontWeight = "bold"; 
            document.getElementById(key).style.fontStyle =  "italic"; 
            document.getElementById(key).style.boxShadow = " -1px 0px 1px rgba(0, 0, 0, 0.5), 1px 0px 1px rgba(0, 0, 0, 0.5)"; 
            document.getElementById(key).style.backgroundColor = "rgba(255,255,255,0.5)";
						// let's push this element id into the stack 
            ISelection.push(key);
        }else {
						// here in case we are clicking on the row we retreive the normal look by inheriting the style from its parent 
            document.getElementById(key).style.fontWeight = "inherit"; 
            document.getElementById(key).style.fontStyle =  "inherit"; 
            document.getElementById(key).style.boxShadow = "inherit";  
            document.getElementById(key).style.backgroundColor = "inherit";
						// then we update the stack by kicking out the element id from it   
            ISelection = deleteFromArray(ISelection,key);
        } 
      }

  }
} // end of the class Row


/*-------------------------------------------------------------------------------------*/
//	this is the class that holds the structure of the header manager                   //
//																																										 //
/*--------------------------------------------------------------------------------------*/

class Header{
  constructor(){
			// (yeah! not too much properties  )
      this.header = [];
  }
	// but still has a getter and a setter 
  set setValues(th){ this.header = th;}
  get getValues(){ return this.header;}

	// this function takes care of showing a new header 
  showHeader(){ 
			// get the html element
      let hrow  = document.getElementById("tableHeader"); 
			// get the column titles 
      let vals = this.getValues;
			// (I try not invoke it without setting the values first)
      if (vals.length == 0) appNotify("there is nothing to show in the header");
      else
			// here we start looping over the titles
      for(let col of vals){
				// we create two html elements: th and the text 
        let th = document.createElement("th");
        let text = document.createTextNode(col);
				// then we append the title
        th.appendChild(text);
        hrow.appendChild(th);
      }
  }
	// this function removes the header (I mean hiding it ;) !!!! whatever lol )
  hideHeader(){
			// we get the only header html element again
      let hrow  = document.getElementById("tableHeader");
			// we ask for the last child
      let child = hrow.lastElementChild;  
			// here we're just making sure were not trying to remove nothing (^_^)
      if(child== null && child == 'undifined')
        appNotify("header has no child");
      else  // in case our header does indeed have kids  
      while (child) { 
						// let's take the last one away from it (^_^)
            hrow.removeChild(child); 
						// then coming back to the next one (lol lol lol)
            child = hrow.lastElementChild; 
      } 

  }
} // end of the class Header

/*----------------------------------------------------------------------------------*/
//		Finaly we get to the table class, !!!			  																	//
//																																									//
/*---------------------------------------------------------------------------------*/
class Table{
    constructor(){
			// an array to gather all the rows
      this.rows= [];
			// and an id tracker (or tracer I don't know lol) to keep an eye on the new rows 
      this.idTracker = 0;
			// when we actualy don't want to add new one but editing an old one
      this.editTarget = null;
    }
		// here we give the access to the table properties
    get getRows(){ return this.rows;}
    get getIdTracker(){ this.idTracker ++; return this.idTracker;}
    get getEditTarget(){ return this.editTarget;}
    get getDescription(){ return this.description;}

    set addRow(r){  this.rows.push(r);}
    set setRows(rs){  this.rows = rs;}
    set setIdTracker(t){ this.idTracker = t;}
    set setEditTarget(id){ this.editTarget = id;}



    // this methode shows every row in the stack 
    tableShow(){
      let rows= this.getRows;
			// loop over rows 
      rows.forEach( (row, index) => {
        // just in case somehow row is null or undefined
        if(row != null || row!= 'undefined'){ 
          // create a new tr element in the table
          row.showRow();  
        }
      });

    }
    // this means remove all the html tr elements but let the rows remain available
    tableHide(){
      let rows = this.getRows;
      // while there is a child remove it 
      rows.forEach(row => {
				// here we call the row methode to do the actual job
        row.hideRow();
      });
    }
    // this table handles the new rows as well as the old ones 
    tableAdd(data){
      // in case what we want is actualy editing a paticular row 
      if (this.getEditTarget != null){
          //  we get that row
          let row = this.getRows.filter( row => row.getId == this.getEditTarget)[0];
					// we modify its content
          row.setData = data;  
					// then refresh it
          row.hideRow();
          row.showRow(); 
					// then kicking it out of the selection stack 
          ISelection = deleteFromArray(ISelection, this.getEditTarget);
          // and turn off the edition flag
          this.setEditTarget = null;
      }
      else{
				// when it comes to new data, that's the easy job, we create a new row
        let new_row = new Row(data , this.getIdTracker);
				// add it to the table properties
        this.addRow = new_row;
				// and show it in the actual table
        new_row.showRow();
      }
    }
    // this methode handles the trash 
    tableDelete(){
			// we get first the list of all the rows we want to get rid of
      let list = ISelection;
				 // then we deal with each one of them
         for(let item of list){
            // get the stored row from the table
            let row= this.getRows.filter(row => row.getId == item)[0];
            // then hide it from the actual table
            row.hideRow();
            // get the index of the row in the stack in table object
            let x = this.getRows.map(row => (row.getId == item)? true:false);
						// we substract it from the stack and save the rest as new one (this helps the economy of the memory)
            this.setRows = deleteFromArray(this.getRows, null, x.indexOf(true)); 
            // then clear it from the selection list (ARRAY STACK HEAP !!!! who cares lol) 
            ISelection=deleteFromArray(ISelection,item);
         }
    }
		// this methode extract the table into an array
    tableRenderArray(){
			// this is the array
      let arr_table=[];
			// and this is how we push every row from the table into the array
      this.getRows.forEach(row => {
        let data = row.getData;
        data = data.map(val => isNumber(val)? parseFloat(val): val);
        arr_table.push(data);
      });
			// and returning back the array
      return arr_table;
    }
		// this is methode does the exact opposite,  it takes data from an array and insert them into the table
    tableFromArray(arr_table=[]){
      // check if we're trying to insert an empty table
      if(arr_table.length <1 ) {
        appNotify ("table is empty ")
        return ;
      }
			// here we're just refreshing the table 
      this.tableHide();
			// we clear the stack and prepare it for new data
      this.setRows = [];
			// then loop over the array and insert the data 
      arr_table.forEach( data => this.tableAdd(data));  
    }
}
// THE END (BELIEVE ME LOL)
