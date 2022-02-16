function randomId(){
    let str = ""
    str+=1+Math.floor(Math.random() * 9)
    for(let j=0;j<4;j++){
        str+=Math.floor(Math.random() * 9)
    }
    return parseInt(str)
}

function createTime(){
    const date = new Date;

    var minutes = date.getMinutes();
    var hour = date.getHours();

    if(hour%10==0){
        hour = `0${hour}`
    }
    if(minutes%10==0){
        minutes = `0${minutes}`
    }
    return (hour+":"+minutes)
}

function createData(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '/' + mm + '/' + dd;
    return today
}

module.exports = {createTime,createData,randomId}