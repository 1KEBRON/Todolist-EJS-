exports.getDate = function(){

 const today = new Date();

    const options = {
        weekday: 'long',
        day:'numeric',
        month:'long'
    };
 return day = today.toLocaleDateString('en-gb',options);
}
