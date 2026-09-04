"use client";

import SplatImage from "../components/SplatImage";


export default function Home(){


return (

<main
style={{
background:"#050505",
minHeight:"100vh",
padding:"50px",
color:"white"
}}
>


<h1>
TEAM
</h1>


<div
style={{
width:"350px",
height:"550px",
background:"#111",
position:"relative",
overflow:"hidden"
}}
>


<div
style={{
height:"70%",
position:"relative"
}}
>


<SplatImage
src="/team/parsa/Flower.splat"
/>


</div>



<div
style={{
padding:"20px"
}}
>

<h2>
ALEX.
</h2>

<p>
Creative Engineer
</p>

</div>


</div>



</main>

)


}