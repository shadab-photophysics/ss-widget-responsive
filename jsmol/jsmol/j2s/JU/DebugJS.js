Clazz.declarePackage("JU");
(function(){
var c$ = Clazz.declareType(JU, "DebugJS", null);
c$._ = Clazz.defineMethod(c$, "_", 
function(msg){
{
if (Clazz._debugging) {
debugger;
}
}}, "~S");
})();
;//5.0.1-v4 Mon Nov 11 18:59:16 CST 2024
