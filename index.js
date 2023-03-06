let myLeadsObj = []
// const inputEl = document.getElementById('input-el')
// const saveBtn = document.getElementById("input-btn")
const editBtn = document.getElementById("edit-btn")
const deleteBtn = document.getElementById("delete-btn")
const ulEl = document.getElementById("ul-el")
const tabBtn = document.getElementById("tab-btn")
const localStorageMyLeads = JSON.parse(localStorage.getItem("myLeads"))


let isSelected = false

if (localStorageMyLeads){
    myLeadsObj = localStorageMyLeads
    renderJsObj(myLeadsObj,isSelected) 
}

editBtn.addEventListener("click",function(){
    editBtn.textContent = "DELETE SELECTED(DblClick)"
    isSelected = true
    renderJsObj(myLeadsObj, isSelected)
    
})

editBtn.addEventListener("dblclick",function(){
    let myLeadsObjTemp = []
    for(let i=0; i < myLeadsObj.length; i++){
        let tempJsObj = {}
        if(myLeadsObj[i].checked){
            delete myLeadsObj[i]
        }else{
            tempJsObj = myLeadsObj[i]
            myLeadsObjTemp.push(tempJsObj)
        }
    }
    myLeadsObj = myLeadsObjTemp
    localStorage.removeItem('myLeads');
    localStorage.setItem("myLeads",JSON.stringify(myLeadsObj))
    isSelected = false
    renderJsObj(myLeadsObj, isSelected)

    editBtn.textContent = "EDIT"
})

// saveBtn.addEventListener('click',function(){
//     let isPresent = false
//     myLeadsObj.forEach((myElement)=>{
//         if(myElement.url === inputEl.value ){
//             isPresent = true
//         }
//     })
//     if(!isPresent){
//         let jsObj = {}
//         jsObj['url'] = inputEl.value
//         jsObj['checked'] = false
//         myLeadsObj.push(jsObj)
//         inputEl.value = ""
//         localStorage.setItem("myLeads", JSON.stringify(myLeadsObj))
//         renderJsObj(myLeadsObj, isSelected)
//     }
// })

deleteBtn.addEventListener("dblclick", function(){
    localStorage.clear()
    myLeadsObj = []
    isSelected = false
    renderJsObj(myLeadsObj, isSelected)
})

tabBtn.addEventListener("click", function(){
    chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
        let isPresent = false
        myLeadsObj.forEach((myElement)=>{
            if(myElement.url === tabs[0].url ){
                isPresent = true
            }
        })
        if(!isPresent){
            let jsObj = {}
            jsObj['url'] = tabs[0].url
            jsObj['checked'] = false
            myLeadsObj.push(jsObj)
            localStorage.setItem("myLeads", JSON.stringify(myLeadsObj))
            isSelected = false
            renderJsObj(myLeadsObj,isSelected)
        }
    })
    
})

function renderJsObj(leadsJsObj, selection){
    if(selection === false){
        ulEl.innerHTML = ""
        for(let i=0; i<leadsJsObj.length; i++){
            const li = document.createElement('li')
            const a = document.createElement('a')
            a.href = leadsJsObj[i].url
            a.target = '_blank'
            a.append(leadsJsObj[i].url)
            li.appendChild(a)
            ulEl.appendChild(li)
        }
    }else{
        ulEl.innerHTML = ""
        for(let i=0; i<leadsJsObj.length; i++){
            const li = document.createElement('li')
            const input = document.createElement('input')
            const a = document.createElement('a')
            input.type = 'checkbox'
            input.id = `checkbox-el-${i}`
            a.href = leadsJsObj[i].url
            a.target = '_blank'
            a.textContent = leadsJsObj[i].url
            li.append(input, a)
            ulEl.append(li)
        }
    }
    renderCheckboxEvents(selection)
}

function renderCheckboxEvents(selection){
    if(selection === true){
        const checkBoxTesting = document.querySelectorAll('[id*="checkbox-el-"]')
        checkBoxTesting.forEach((el)=>{
            el.addEventListener("change",function(event){
                let idValue = event.target.id.split('-')[2]
                myLeadsObj[idValue].checked = el.checked 
        })})
        console.log(checkBoxTesting)
    }
}
