const addToCart = async (idProducto) => {
    const url = window.location.href.replace(`/${idProducto}`,"").replace("products","") + "api/carts";

    let data = sessionStorage.getItem("cart");

    if(data && data !== "undefined"){
        const newUrl = url + `/${data}/product/${idProducto}`;
        let response = await fetch(newUrl,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            let json = await response.json();
            console.log(json);
            if(json.status != 'error'){
                console.log(`Producto ${idProducto} agregado al carrito ${data}`);
            }
            else
                alert("Un admin no puede comprar"); 
        } else {
        alert("Error-HTTP: " + response.status);
        }
    }
    else{
        let response = await fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify
            (
                {
                    "products": [{
                        "product": idProducto
                    }]
                }
            )
        });
        if (response.ok) {
            let json = await response.json();
            console.log(json);
            if(json.status != 'error'){
                sessionStorage.setItem("cart", json.message._id);
                console.log("Creado carrito ", json.message._id);
            }
            else
                alert("Un admin no puede comprar");        
        } else {
        alert("Error-HTTP: " + response.status);
        }
    }
}

const purchase = async () => {
    let data = sessionStorage.getItem("cart");
    if(data && data !== "undefined"){
        const url = window.location.href.replace("products","") + "api/carts" + `/${data}/purchase`;

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
            //console.log(`Producto ${idProducto} agregado al carrito ${data}`);
        } else {
        alert("Error-HTTP: " + response.status);
        }
    }
    else
    alert("No hay un carrito con productos");
}