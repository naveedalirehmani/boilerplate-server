async function loginToGoogle() {
    console.log('called')
    console.log('loginrequest')
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  
    const options = {
      redirect_uri: 'http://localhost:4000/v1/authentication/oauth/google',
      client_id: '319346451933-0gubo6f16cl6unrl54jbnp8btaqjh3ul.apps.googleusercontent.com',
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };
  
    const qs = new URLSearchParams(options);
    console.log({qs})
    const consentScreenURI = `${rootUrl}?${qs.toString()}`;

    window.location.href = consentScreenURI;    
}
