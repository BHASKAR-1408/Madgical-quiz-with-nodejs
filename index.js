const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyparser = require('body-parser');
const router = express.Router();
const app = express();
app.use(bodyparser.json());

app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static('views'));
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs');

let questionsList = JSON.parse(fs.readFileSync('questions.json')); 
let answersList = JSON.parse(fs.readFileSync('answers.json'));
let indexOfquestionslist = 0
let correctAnswers = 0
let wrongAnswers = 0
let level = 0;


// for welcoming:-
app.get('/',(req,res)=>{
	level = 0
	indexOfquestionslist = 0
	correctAnswers = 0
	wrongAnswers = 0
	res.render("question",{question:''})
})


// for display question
app.get('/question',(req,res)=>{
	res.render('question',{question:[questionsList[indexOfquestionslist],level]})
	
})


// final status
app.get('/register',(req,res)=>{
	res.render('end',{status:{w:wrongAnswers,c:correctAnswers,l:level}})
})

// for processing
app.post('/processing',(req,res)=>{
	if( indexOfquestionslist == questionsList.length-1){
		res.redirect('/register')
	}
	else{
		if(answersList[indexOfquestionslist] == req.body.answer){
			level+=1
			indexOfquestionslist+=1
			correctAnswers+=1
			console.log(level)
			res.redirect('/question')
		}
		else
		{
			indexOfquestionslist+=1
			level = Math.floor(level/2)
			wrongAnswers+=1
			res.redirect('/question')
		}
	}

})

const port = process.env.PORT || 8000;

app.listen(port,(err)=>{
	if(err)throw err;
	console.log("Your port is listening!")
});

