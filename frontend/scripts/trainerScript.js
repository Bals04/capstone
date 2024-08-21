

//===========================WORKOUT PLAN JS===========================//
function cancel_viewWorkout(){
    var viewWorkout_popup = document.getElementById('view_workout_popup')
    viewWorkout_popup.classList.add('invisible')
}

function modify_Workout(){
    var modify_workout_popup = document.getElementById('modify_workout_popup')
    modify_workout_popup.classList.remove('invisible')
}
function cancel_modify_Workout(){
    var modify_workout_popup = document.getElementById('modify_workout_popup')
    modify_workout_popup.classList.add('invisible')
}

function add_Workout(){
    var add_workout_popup = document.getElementById('add_workout_popup')
    add_workout_popup.classList.remove('invisible')
}
function cancel_add_Workout(){
    var add_workout_popup = document.getElementById('add_workout_popup')
    add_workout_popup.classList.add('invisible')
}

function viewWorkout(planType){
    const header = document.getElementById('workout_h1_header')
    header.textContent = planType

    if (planType == 'Bulking Workout Plan'){
        const form = document.getElementById('view_workout_popup');
        form.classList.remove('invisible')

    }else if(planType == 'Strength Training Workout Plan'){
        const form = document.getElementById('view_workout_popup');
        form.classList.remove('invisible')

    }else if(planType == 'Body Building Workout Plan'){
        const form = document.getElementById('view_workout_popup');
        form.classList.remove('invisible')
    }
    else if(planType == 'Shredding Workout Plan'){
        const form = document.getElementById('view_workout_popup');
        form.classList.remove('invisible')
    }
}







//=====================================MEAL PLAN JS=============================================//


function customMeal(){
    var customMeal = document.getElementById('custom_meal')
    var premade_MealContent = document.getElementById('premade_meal')
    customMeal.classList.remove('invisible')
    premade_MealContent.classList.add('invisible')
}
function premadeMeal(){
    var premade_Meal = document.getElementById('custom_meal')
    var premade_MealContent = document.getElementById('premade_meal')
    var button = document.getElementById('button')
    premade_Meal.classList.add('invisible')
    premade_MealContent.classList.remove('invisible')
    button.classList.remove('duration-300')
}


function addnewMealPlan(){
    var newPlan_popup = document.getElementById('add_new_template_pop_up')
    newPlan_popup.classList.remove('invisible')
}
function cancel_addnewMealPlan(){
    var newPlan_popup = document.getElementById('add_new_template_pop_up')
    newPlan_popup.classList.add('invisible')
}

function cancel_viewMeal(){
    var viewMeal_popup = document.getElementById('view_meal_popup')
    viewMeal_popup.classList.add('invisible')
}

function modify_Meal(){
    var modify_meal_popup = document.getElementById('modify_meal_popup')
    modify_meal_popup.classList.remove('invisible')
}
function cancel_modify_Meal(){
    var modify_meal_popup = document.getElementById('modify_meal_popup')
    modify_meal_popup.classList.add('invisible')
}

function add_Meal(){
    var add_meal_popup = document.getElementById('add_meal_popup')
    add_meal_popup.classList.remove('invisible')
}
function cancel_add_Meal(){
    var add_meal_popup = document.getElementById('add_meal_popup')
    add_meal_popup.classList.add('invisible')
}

// function greet(){
//     const toGreet = document.getElementById('greeting')
//     const getDate = new Date();
//     let time = getDate.getTime();
//     alert(getDate)
//     toGreet.innerHTML = ``
// }

function viewMeal(planType){
    const header = document.getElementById('meal_h1_header')
    header.textContent = planType

    if (planType == 'Bulking Meal Plan'){
        const form = document.getElementById('view_meal_popup');
        form.classList.remove('invisible')

    }else if(planType == 'Strength Training Meal Plan'){
        const form = document.getElementById('view_meal_popup');
        form.classList.remove('invisible')

    }else if(planType == 'Body Building Meal Plan'){
        const form = document.getElementById('view_meal_popup');
        form.classList.remove('invisible')
    }
}



//===================MEMBERS JS======================//

// const form = document.getElementById('view_students');
//         form.innerHTML = `
//         <div class="title_and_button"> 
//             <h1>${planType} Details</h1>
//             <button class="material-symbols-outlined" onclick="add_Workout()">add <span>Add Workout</span></button>
//         </div>
//         <div>
//             <table>
//                 <tr>
//                     <th>Exercise Name</th>
//                     <th>Repititions</th>
//                     <th>Sets</th>
//                     <th>Target Muscle Group</th>
//                     <th>Week No</th>
//                     <th>Day No</th>
//                     <th></th>
//                 </tr>
//                 <tr>
//                     <td>1</td>
//                     <td>2</td>
//                     <td>3</td>
//                     <td>4</td>
//                     <td>5</td>
//                     <td>6</td>
//                     <td><button onclick="modify_Workout()">Modify</button></td>
//                 </tr>
//                 <tr>
//                     <td>1</td>
//                     <td>2</td>
//                     <td>3</td>
//                     <td>4</td>
//                     <td>5</td>
//                     <td>6</td>
//                     <td><button onclick="modify_Workout()">Modify</button></td>
//                 </tr>
//                 <tr>
//                     <td>1</td>
//                     <td>2</td>
//                     <td>3</td>
//                     <td>4</td>
//                     <td>5</td>
//                     <td>6</td>
//                     <td><button onclick="modify_Workout()">Modify</button></td>
//                 </tr>
//             </table>
//         </div>
//         <div class="button_div">
//             <input class="button" type="button" value="CLOSE" onclick="cancel_viewWorkout()">
//         </div>
//         `