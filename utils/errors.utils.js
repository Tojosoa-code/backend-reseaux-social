module.exports.signUpErrors = (error) => {
    let errors = {pseudo : "", password : "", email : ""}

    if (error.message.includes("email"))
        errors["email"] = "Email incorrect ❌"

    if (error.message.includes("password"))
        errors["password"] = 'Le mot de passe doit être 6 caractères minimum.'

    if (error.message.includes("pseudo"))
        errors["pseudo"] = 'Pseudo incorrect ❌'

    if (error.code === 11000 && Object.keys(error.keyValue)[0].includes("email"))
        errors["email"] = 'Cet email est déjà enregistré dans la base de donnée.'

    if (error.code === 11000 && Object.keys(error.keyValue)[0].includes("pseudo"))
        errors["pseudo"] = 'Ce pseudo est déjà pris par quelqu\'un.'

    return errors
}

module.exports.signInErrors = (error) => {
    let errors = {password : "", email : ""}

    if (error.message.includes("email"))
        errors["email"] = "Email inconnu ❌"

    if (error.message.includes("password"))
        errors["password"] = "Le mot de passe ne correspond."

    return errors

}
module.exports.uploadErrors = (error) => {
    let errors = { maxSize: "", format: "" };

    // Ce message doit correspondre exactement à ce qui est lancé dans le controlleur
    if (error.message.includes("invalid file"))
        errors.format = "Format incompatible";

    if (error.message.includes("max size"))
        errors.maxSize = "Le fichier dépasse 5Mo";

    return errors;
};