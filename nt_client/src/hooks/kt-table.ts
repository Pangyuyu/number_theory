export default function(){
    function tableImageRowStyle({row,rowIndex}:any){
        let rowStyle = {
            color: "black",
            fontSize: "12px",
            height: "25px"
        };
        return rowStyle;
    }
    return {
        tableImageRowStyle
    }
}