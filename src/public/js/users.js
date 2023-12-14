const modifyRole = async (idUsuario) => {
    const url = window.location.href.replace("userManager","") + "api/users/premium/" + idUsuario;
    console.log(url);
    
    let response = await fetch(url,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    
    if (response.ok) {
        let json = await response.json();
        console.log(json);
    } else {
    alert("Error-HTTP: " + response.status);
    }
};

const deleteUser = async (idUsuario) => {
    const url = window.location.href.replace("userManager","") + "api/users/" + idUsuario;
    console.log(url);
    
    let response = await fetch(url,{
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    
    if (response.ok) {
        let json = await response.json();
        console.log(json);
    } else {
    alert("Error-HTTP: " + response.status);
    }
};