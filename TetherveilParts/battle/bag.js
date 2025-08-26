export function createBag() {

    let bagStatus = false;
    let isCategOpen = false;


    const bagWrapper = document.createElement('div');

    /*const categoriesWrapper = document.createElement('div');
    categoriesWrapper.classList.add('bag-Category');

     */


    const bagOpen = document.createElement('div')
    bagOpen.classList.add('bag-open');

    const bagButton = document.createElement('div');
    bagButton.classList.add('open-bag-btn');
    bagButton.addEventListener('click', e =>{
        if(bagStatus === false) {
            bagOpen.style.display='flex';
            bagStatus = true;
            switchCategory(categAttack, allCategories)
        }
        else{
            bagOpen.style.display='none';
            bagStatus = false;
        }

    });

    const categButtons = document.createElement('div');
    categButtons.classList.add('bag-categ-rahmen')
    bagButton.addEventListener('click', e => {
        bagWrapper.style.display='flex';
    });

    const categAttack = document.createElement('div');
    categAttack.classList.add('bag-Category');

    let tempCurrentDiv = 'none';


    const categHealing = document.createElement('div');
    categHealing.classList.add('bag-Category');
    categHealing.style.backgroundColor = "red";

    const allCategories = [categAttack, categHealing];

    /*switchCategory(categAttack, allCategories);*/

    const categories = [
        {text: 'attack', id: 0, action: () => {
            bagOpen.appendChild(categAttack);
            switchCategory(categAttack, allCategories)



            /*categAttack.style.display = 'flex'*/
        }},
        {
            text: 'healing', id: 1, action: () => {
                bagOpen.appendChild(categHealing);
                switchCategory(categHealing, allCategories)

                /*categHealing.style.display = 'flex'*/
            }
        }
    ]

    function switchCategory(newCateg, allCategories){
        if(tempCurrentDiv === newCateg){
            return;
        }

        allCategories.forEach(e=> e.style.display = 'none');

        bagOpen.appendChild(newCateg);
        newCateg.style.display = 'flex';

        tempCurrentDiv = newCateg;
    }


    /*function getCategID(getID){
        return categories[getID].id;
    }

    function checkCateg(){
        if(tempCurrentDiv === )
    }
    */

    categories.forEach(({text, action}) =>{
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.classList.add('menu-button');
        btn.addEventListener('click', action);
        categButtons.appendChild(btn);
    });

    bagOpen.appendChild(categButtons);

    bagWrapper.appendChild(bagButton);
    bagWrapper.appendChild(bagOpen);

    console.log('bag wurde erstellt. fabio ist süß');
    return bagWrapper;

}
