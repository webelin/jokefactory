const host = '20.21.246.173:80'

window.onload = async () => {
    console.log('here')
    const select = document.getElementById('types');
    const types = [...await (await fetch(`http://${host}/gettypes`)).json(), {id: -1, type: 'any'}]

    const selectElements = types.map(x => `<option value="${x.type}">${x.type}</option>`);

    console.log(types)

    selectElements.forEach(element => {
        select.insertAdjacentHTML('beforeend', element);
    });
}

async function getJokes(type, count) {
    let jokes = await (await fetch(`http://${host}/jokes/type=${type}&${count}`)).json();
    console.log(jokes)

    let div = document.getElementById('jokes');
    div.innerHTML = '';


    jokes.forEach(x => {
        div.insertAdjacentHTML('beforeend',
            `<p class="h5">
                ${x.setup}
            </p>
            <p>
                ${x.punchline}
            </p>
            <br>`
        );
    })
}
