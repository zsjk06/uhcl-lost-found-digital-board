// Supabase setup
const supabaseUrl = 'https://pmolaajaloowazzmjhoi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtb2xhYWphbG9vd2F6em1qaG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjczNjcsImV4cCI6MjA4NjQwMzM2N30.cOMKqQ_4gjVdFsIYEFY0CwlRWWYgSBw09pLZ8Je41Wg';
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Please enter your UHCL username.");
        return;
    }

    const email = username + "@uhcl.edu";
    const password = "UHCL_MVP_2026";

    // Try login first
    let { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    // If login fails (new user), create account silently
    if (error) {
        const { error: signUpError } = await supabaseClient.auth.signUp({ email, password });
        if (signUpError) {
            alert("Authentication error: " + signUpError.message);
            return;
        }

        // 3️⃣ Login again after signup
        const result = await supabaseClient.auth.signInWithPassword({ email, password });
        data = result.data;
        error = result.error;
    }

    if (error) {
        alert("Login failed: " + error.message);
        return;
    }

    // 4️⃣ Success — user is logged in
    console.log("Logged in user:", data.user);
    localStorage.setItem("currentUser", JSON.stringify(data.user));

    alert("Login successful!");
    window.location.href = "./homepage.html"; // uncomment when homepage ready
});
