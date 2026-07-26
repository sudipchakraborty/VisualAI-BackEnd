function passwordResetTemplate({

    name,

    resetLink

}){

return `

<h2>Password Reset</h2>

<p>Hello ${name},</p>

<p>We received a request to reset your password.</p>

<p>

<a href="${resetLink}">

Reset Password

</a>

</p>

<p>

This link expires in 15 minutes.

</p>

`;

}

module.exports={

passwordResetTemplate

};