/*------------------------------------------------------------------------------------  */
/*		this is what it is all about! a simple algorithm that helps us to decide !!!      */
/*    it takes some certain criteria with their impacts on the decision and it imagines */ 
/*    what could be possibly the best alternative for each criterion and what could be  */
/*    the worst as well, and it measures the distance between the actual alternatives 	*/
/*    and those ideals.  All with mathematical magic  																	*/
/*		( https://en.wikipedia.org/wiki/TOPSIS) this is the link to the article 				  */
/*    that explains this methode in the wikipedia 																	    */
/*--------------------------------------------------------------------------------------*/

// this is  a bunch of handy functions
// as in mathematics 
let transpose=function(matrix){
	let [row] = matrix; 
	// here map each row with a colomun and verse versa
	return row.map((value, column) => matrix.map(row => row[column]));

}
// that sums all the cells in one row as in  sum of V[i]^p
let sum=(V, p=1)=> V.reduce((total, val)=>(total + Math.pow(val,p)), 0); 

// this ascending sorts an array // Arr is expected to be a 2d arr
let sortArray=(Arr)=> Arr.sort((a, b) => a[0] - b[0]); 
 
// and voila the topsis function  (where the magic happens ^_^ ) 
let topsis=function(X, W, impacts){ 
	/*  M matrix is expected to be as following :
				 					criterion1   criterion2  ...
		alternative1		
		alternative2   
			...						
	*/
		for(let i of X)
			for(let j of i)
				j = parseInt(j);

		// STEP 1: decision matrix, weights, and impacts all set  
		X = transpose(X);
		let W_total = sum(W); 
		if ( W_total!= 1) W = W.map(item => item*(1/W_total));


		// STEP 2: normalizing the matrix to obtain the matrix R 
		let average;
		let R = [];
		X.forEach((item, index)=>{
				average = sum(item, 2) ;
				average = 1 / Math.sqrt(average); 
				R.push( item.map(val => val*average));
		
		});


		// STEP 3: calculate the weighted matrix T
		let T=[];
		R.forEach( (item, index)=> T.push(item.map(val => val*W[index])));


		// STEP 4: find the worst and the best ideal alternatives: Aplus and Aminus 
		let Aplus = [];
		let Aminus = [];
   		 T.forEach((item, index)=>{
				if(impacts[index]){
					Aplus.push(item.reduce((a, b) => Math.max(a, b)));
        			Aminus.push(item.reduce((a, b) => Math.min(a, b)));
				}else {
        			Aplus.push(item.reduce((a, b) => Math.min(a, b)));
        			Aminus.push(item.reduce((a, b) => Math.max(a, b)));
				}
		});


		// STEP 5: finding the distance from the ideal solution
		let Dplus = transpose (T);
		let Dminus = Dplus;

		Dplus = Dplus.map(row=>{
			let r= row.map((item, index)=> (item - Aplus[index]));
			return sum(r,2); 
		});
		Dminus = Dminus.map(row=>{
			let r= row.map((item, index)=> (item - Aminus[index]));
			return sum(r,2); 
		});


		Dplus = Dplus.map(item => Math.sqrt(item));
		Dminus = Dminus.map(item => Math.sqrt(item));

		let rank = transpose([Dminus, Dplus]);
		rank = rank.map(item => item[0]/(sum(item)));
		return rank;

}
// the end 
