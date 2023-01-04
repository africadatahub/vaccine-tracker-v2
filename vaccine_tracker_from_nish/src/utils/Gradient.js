import Gradient from 'javascript-color-gradient';


export let CaseGradient = (amount, midpoint) => {

    let midpoint_set = midpoint == undefined ? 250 : midpoint;

    let scale = new Gradient();

    scale.setGradient('#000', '#000').setMidpoint(midpoint_set);

    if (amount == null || amount == 'NaN') {
        selectedColor = '#fff';
    } else {
        return scale.getColor(amount > 0 ? amount : 1);
    }

    return selectedColor;

}