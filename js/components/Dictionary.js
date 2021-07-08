class Dictionary {
    constructor(selector) {
        this.selector = selector;
        this.DOM = null;
        this.listDOM = null;

        this.addFormDOM = null;
        this.enWordDOM = null;
        this.ltWordDOM = null;
        this.buttonSaveDOM = null;

        this.updateFormDOM = null;
        this.updateEnWordDOM = null
        this.updateLtWordDOM = null
        this.buttonUpdateDOM = null
        this.buttonCancelDOM = null

        this.localStorageIDcount = 'dictionaryID';
        this.localStorageNewInputKey = 'newInput';
        this.latestUsedID = JSON.parse(localStorage.getItem(this.localStorageIDcount)) || 0
        this.newInput = JSON.parse(localStorage.getItem(this.localStorageNewInputKey)) || [];

        this.currentlyEditableTaskID = 0;

        this.init();
    }

    init() {
        if (!this.isValidSelector()) {
            return false;
        }

        this.DOM = document.querySelector('.dictionary');
        if (!this.DOM) {
            console.error('ERROR: nerasta vieta, pagal duota selector');
            return false;
        }
        this.render();
        this.renderList();
        this.addEvents();
    }

    isValidSelector() {
        if (typeof this.selector !== 'string' ||
            this.selector === '') {
            console.error('ERROR: nevalidus selector');
            return false;
        }
        return true;
    }

    generateInitialForm() {
        return `<div class="top" id="add_task">
            <h1>Dictionary</h1>
            <form>
                <div class="anglu">
                    <label for="en">English</label>
                    <input type="text" id="en">
                </div>
                <div class="lietuviu">
                    <label for="lt">Lietuviu</label>
                    <input type="text" id="lt">
                </div>
                <div class="mygtukai">
                    <button id="save" type="submit">Save</button>
                    <button id="reset" type="reset">Reset</button>
                </div>
            </form>
            </div>`
    }

    generateUpdatedForm() {
        return `<div class="top hide" id="update_task">
            <h1>Dictionary</h1>
             <form>
             <div class="anglu">
            <label for="en-update">English</label>
            <input type="text" id="en-update">
            </div>
            <div class="lietuviu">
            <label for="lt-update">Lietuviu</label>
            <input type="text" id="lt-update">
            </div>
            <div class="mygtukai">
            <button id="update_button" type="submit">Update</button>
            <button id="cancel_button" type="button">Cancel</button>
            </div>
        </form>
        </div>`
    }

    generateTitles() {
        return `<div class="titles1">
                <div class="english-title">
                    <h2>EN</h2>
                </div>
                <div class="lithuanian-title">
                    <h2>LT</h2>
                </div>
                <div class="actions1">
                    <h2>Actions</h2>
                </div>
            </div>`
    }

    generateList() {
        return `<div class="list"></div>`
    }

    renderList() {
        for (const word of this.newInput) {
            this.renderListItem(word.id, word.englishText, word.lithuanianText);
        }
    }

    renderListItem(id, textEN, textLT) {
        if (typeof textEN !== 'string' ||
            textEN === '') {
            return '';
        }
        if (typeof textLT !== 'string' ||
            textLT === '') {
            return '';
        }
        const HTML = `<div id="ivestis_${id}" class="ivestis">
                <div class="english">${textEN}</div>
                <div class="lithuanian">${textLT}</div>
                <div class="actions">
                    <div class="btn edit">Edit</div>
                    <div class="btn delete">Delete</div>
                </div>
            </div>`;

        this.listDOM.insertAdjacentHTML('afterbegin', HTML);

        const ivestysActionsDOM = this.listDOM.querySelector('.ivestis')
        const editDOM = this.listDOM.querySelector('.edit')
        const deleteDOM = this.listDOM.querySelector('.delete')

        deleteDOM.addEventListener('click', (e) => {
            if (!confirm('Ar tikrai norite istrinti irasa?')) {
                return false;
            }
            ivestysActionsDOM.remove();

            this.newInput = this.newInput.filter((word) => word.id !== id)
            localStorage.setItem(this.localStorageIDcount, JSON.stringify(this.latestUsedID));
        })

        editDOM.addEventListener('click', (e) => {
            this.addFormDOM.classList.add('hide')
            this.updateFormDOM.classList.remove('hide')

            this.updateEnWordDOM.value = textEN;
            this.updateLtWordDOM.value = textLT;
            this.currentlyEditableTaskID = id;

        })


    }

    render() {
        let HTML = '';

        HTML += this.generateInitialForm();
        HTML += this.generateUpdatedForm();
        HTML += this.generateTitles()
        HTML += this.generateList();
        this.DOM.innerHTML = HTML;

        this.listDOM = this.DOM.querySelector('.list');
        this.addFormDOM = document.getElementById('add_task')
        this.enWordDOM = document.getElementById('en');
        this.ltWordDOM = document.getElementById('lt');
        this.buttonSaveDOM = document.getElementById('save');
        this.titlesDOM = document.querySelector('.titles1')

        this.updateFormDOM = document.getElementById('update_task')
        this.updateEnWordDOM = document.getElementById('en-update')
        this.updateLtWordDOM = document.getElementById('lt-update')
        this.buttonUpdateDOM = document.getElementById('update_button')
        this.buttonCancelDOM = document.getElementById('cancel_button')
    }

    addEvents() {
        //pridedamas uzrasas
        this.buttonSaveDOM.addEventListener('click', (e) => {
            e.preventDefault();
            // if (!confirm('Ar tikrai norite prideti irasa')) {
            //     return false;
            // }
            const textEnglish = this.enWordDOM.value;
            const textLithuanian = this.ltWordDOM.value;

            if (textEnglish === '' || textLithuanian === '') {
                return false;
            }

            this.newInput.push({
                id: ++this.latestUsedID,
                englishText: textEnglish,
                lithuanianText: textLithuanian
            })

            this.renderListItem(this.latestUsedID, textEnglish, textLithuanian);


            localStorage.setItem(this.localStorageIDcount, JSON.stringify(this.latestUsedID));
            localStorage.setItem(this.localStorageNewInputKey, JSON.stringify(this.newInput));

        })

        this.buttonCancelDOM.addEventListener('click', (e) => {
            e.preventDefault();
            this.addFormDOM.classList.remove('hide')
            this.updateFormDOM.classList.add('hide')
        })

        this.buttonUpdateDOM.addEventListener('click', (e) => {
            e.preventDefault();
            const textEnglish = this.updateEnWordDOM.value
            const textLithuanian = this.updateLtWordDOM.value;

            for (const ivestis of this.newInput) {
                if (ivestis.id === this.currentlyEditableTaskID) {
                    ivestis.englishText = textEnglish;
                    ivestis.lithuanianText = textLithuanian
                }
            }
            localStorage.setItem(this.localStorageNewInputKey, JSON.stringify(this.newInput));

            const ivestisDOM = this.DOM.querySelector('#ivestis_' + this.currentlyEditableTaskID)
            const ivestisEnTextDOM = ivestisDOM.querySelector('.english')
            const ivestisLtTextDOM = ivestisDOM.querySelector('.lithuanian')
            ivestisEnTextDOM.innerText = textEnglish;
            ivestisLtTextDOM.innerText = textLithuanian;
            this.addFormDOM.classList.remove('hide');
            this.updateFormDOM.classList.add('hide');
        })
    }

}
export { Dictionary }