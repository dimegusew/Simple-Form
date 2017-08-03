
jQuery(function($){
   $("#telephone").mask("+7(999) 999-99-99");
});

var authorizedDomens = ["ya.ru","yandex.ru","yandex.ua","yandex.kz","yandex.by","yandex.com"];


var myForm = {
    inputs: function(){
        var inputArr = document.querySelectorAll("input");
        return inputArr;
    }(),
	
	validate: function(){
        var errorFields = [];
			for (var i=0; i < myForm.inputs.length; i++){
				if (!validAll(myForm.inputs[i])){	
					 errorFields.push(myForm.inputs[i].name);
					 myForm.inputs[i].className = "error";
				}
				else {myForm.inputs[i].className = "none";
				}
			}
		return {errorFields,isValid : !errorFields.length }	
	 },
	
	getData : function(){
		var data={};
		for (i = 0; i <myForm.inputs.length; i++){
			data[myForm.inputs[i].name] = myForm.inputs[i].value;
		}
		return data;
	},
	
	submit: function(){
        if( myForm.validate().isValid ){
			console.log(myForm.validate())
			console.log(myForm.getData())

			$('#submitButton').prop('disabled', true);

	        $.ajax({
	            type: "POST",
	            url: $('#myForm').attr('action'),
	            dataType: "json",
	            data: myForm.getData()
			}).done(function(inp){

				console.log(inp.status)
				if (inp.status=="error"){
					$("#resultContainer").html(inp.reason);
				}
				if (inp.status=="success"){
					$("#resultContainer").html(inp.status);
					$("#resultContainer").css({"color":"green"});
				}
				if (inp.status=="progress"){
					$("#resultContainer").html(inp.status);
					$("#resultContainer").css({"color":"blue"});

			$("#resultContainer").html("Wait");
				setTimeout( myForm.submit, inp.timeout );
				}
				$('#submitButton').prop('disabled', false);
			})
		}
		else {$("#resultContainer").html("");}
	}
}

function validAll(input){
	if(input.name == "fio")
		return (validFio(input.value))
	if(input.name == "email")
		return (validEmail(input.value))
	if(input.name == "phone")
		return (validPhone(input.value))	
};

function validFio(str){
	var newArr = str.split(" ");
		if (newArr.length==3){	
			return (true)
		}
		else {return(false)}
}

function validEmail(str){
	var backspaceCheck = str.split(" ");
	var currentDomen = str.split("@")[1];
	if (authorizedDomens.indexOf(currentDomen) ===-1 || str.length===0)
		return false;
	else {return true}
}

function validPhone(str){
	if (str.length===0) {
		return false
	}
	else{	
		var inputArr = str.replace(/\D+/g,"").split("");
		var digitArr = inputArr.map(function(digit){
			return parseInt(digit,10)
		})
		var sum = digitArr.reduce(function(x,y){
			return x+y
		})
		if (str.length != 17 || sum>30){
			return (false);
		}
		else {return true}
	}
}

