import fetch from 'node-fetch';


function getDepartments() {
    fetch('/api/departments', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        response.json();
    }).then((data) => {
        console.log(data);
    }).catch((error) => console.log(error));
};

getDepartments()