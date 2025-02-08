const addBtn =document.querySelector('.add-btn');
const modalCont =document.querySelector('.modal-cont');
const mainCont =document.querySelector('.main-cont');
const textArea =document.querySelector('.textArea-cont');
const allPriorityColors = document.querySelectorAll('.priority-color');
const removeBtn = document.querySelector('.remove-btn');
const toolBoxColors=document.querySelectorAll('.color-box');


let ticketsArr = []




//colors array

const colors=['lightpink', 'lightgreen',  'lightblue', 'black']

modalCont.style.display='none';

//local variables

let modalPriorityColor ='black'

let unlockClass = 'fa-lock-open'
let lockClass = 'fa-lock'

let addtaskFlag= false;
let removeTaskFlag= false;

const ticketsFromLocalStorage =JSON.parse (localStorage.getItem('ticketsArr'))

if(ticketsFromLocalStorage){
   ticketsArr = ticketsFromLocalStorage;
   
   ticketsArr.forEach(function(ticket){
      createTicket(ticket.id,ticket.TicketTask,ticket.ticketColor)
   })
}

//modal toggle
addBtn.addEventListener('click',function(){
   addtaskFlag=!addtaskFlag

   if(addtaskFlag ==true){
    modalCont.style.display='flex'
   }else{
    modalCont.style.display='none'
   }
});

// make the delete button Active
 removeBtn.addEventListener('click',function(){
   removeTaskFlag = !removeTaskFlag;

   if(removeTaskFlag===true){
      alert('Delete button is Activated')
      removeBtn.style.color='red'
   }
   else{
      alert('Delete Button Deactivated')
      removeBtn.style.color='white'
   }
 })

//Generating the ticket
modalCont.addEventListener('keydown', function(e){
   let key=e.key
   console.log(key)

   if(key==='Shift'){
      let task = textArea.value
      let id = shortid()
      createTicket(null,task,modalPriorityColor);
      textArea.value = "";
   }
})

function createTicket(ticketId,ticketTask,ticketColor){
   let id;
   if(ticketId){
       id=ticketId
   }else{
       id= shortid()
   }
  
   let ticketCont=document.createElement('div');
   ticketCont.setAttribute('class', 'ticket-cont');
   console.log(ticketCont)

   ticketCont.innerHTML=`<div 
        class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${id}</div>
        <div class="ticket-task">${ticketTask}</div>
        <div class="ticket-lock"><i class="fa-solid fa-lock"></i>
      </div>`;

   mainCont.appendChild(ticketCont)
   modalCont.style.display='none';

   handleLock(id,ticketCont)
   handleRemoval(id,ticketCont)
   handleColor(id,ticketCont);// to change the color band
   
   if(!ticketId){
      ticketsArr.push({id,ticketTask,ticketColor})
      localStorage.setItem("ticketsArr",JSON.stringify(ticketsArr));
   }

   console.log(ticketsArr)
}

allPriorityColors.forEach(function(colorElem){
   colorElem.addEventListener('click',function(){
      allPriorityColors.forEach(function(priorityColorElements){
         priorityColorElements.classList.remove('active')
      })
      colorElem.classList.add('active')
      let colorSelected = colorElem.classList[1]
      modalPriorityColor=colorSelected
   });
  
});
//ticket Filteration wrt colors
toolBoxColors.forEach(function(colorBox,i){
   colorBox.addEventListener('click',function(){
      let selectedToolBoxColor=toolBoxColors[i].classList[0]
      debugger
      let filteredTickets = ticketsArr.filter(function(ticket){
         return selectedToolBoxColor === ticket.ticketColor
      })
      mainCont.innerHTML=''

      filteredTickets.forEach(function(filteredTickets){
         createTicket(filteredTickets.id,filteredTickets.ticketTask,filteredTickets.ticketColor)
      })
      
   })
      colorBox.addEventListener('dblclick',function(){
         mainCont.innerHTML='';
         ticketsArr.forEach(function(ticket){
            createTicket(ticket.id,ticket.ticketTask,ticket.ticketColor)
         })
      })
})

//lock handling to edit content

 function handleLock(id,ticket){
   let ticketLockElem = ticket.querySelector('.ticket-lock')

   let ticketLockIcon = ticketLockElem.children[0]
   console.log(ticketLockIcon)

   let ticketTaskArea= ticket.querySelector('.ticket-task')

   ticketLockIcon.addEventListener('click',function(){

      
   if(ticketLockIcon.classList.contains(lockClass)){
      ticketLockIcon.classList.remove(lockClass)
      ticketLockIcon.classList.add(unlockClass)

      ticketTaskArea.setAttribute('contenteditable','true')
   }else{
      ticketLockIcon.classList.remove(unlockClass)
      ticketLockIcon.classList.add(lockClass)
      ticketTaskArea.setAttribute('contenteditable','false')

      let idx = ticketsArr.findIndex(function(ticket){
         return ticket.id === id;
       })
       ticketsArr[idx].TicketTask = ticketTaskArea.textContent;
       
      console.log('checking tickets array after edit')
      console.log(ticketsArr);
      updateLocalStorage();
   }
 })

   
}
 //delete the tickets 

 function handleRemoval(id,ticket){
   ticket.addEventListener('click', function(){
      if(!removeTaskFlag) return 
      ticket.remove();//removing from the Ui
      ticketsArr=ticketsArr.filter(function(ticket){
         return ticket.id !=id;
      })
      console.log("Checking tickets array after deletion")
      console.log(ticketsArr)
      updateLocalStorage();
   })
}

//handle colorband change

function handleColor(id,ticket){
  let ticketColorBand=ticket.querySelector('.ticket-color')
  ticketColorBand.addEventListener('click',function(){
   let currentColor=ticketColorBand.classList[1]
   let currentColorIdx= colors.findIndex(function(color){
      return currentColor=== color
   })
      currentColorIdx++
      let newTicketColorIdx=currentColorIdx % colors.length
      let newTicketColor = colors[newTicketColorIdx]

      ticketColorBand.classList.remove(currentColor)
      ticketColorBand.classList.add(newTicketColor)

      let idx=ticketsArr.findIndex(function(ticket){
         return ticket.id=== id;
      })
      ticketsArr[idx].ticketColor = newTicketColor

      console.log("----------Inside color change value of ticket array-----------")
      console.log(ticketsArr)
      updateLocalStorage();
  })
}

function updateLocalStorage(){
   localStorage.setItem('ticketsArr',JSON.stringify(ticketsArr));
}