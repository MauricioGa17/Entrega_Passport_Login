const onAgregarCart = (value) => {

    const url = '/api/cart/';
    const data = { product: value._id};

    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => 
        res.json()
    ).catch((error) => {
        console.error("Error:", error)
    }).then((response) => {
        console.log(response)
    });
}