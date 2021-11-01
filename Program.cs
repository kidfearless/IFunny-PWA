using IFunny.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews().AddJsonOptions(t =>
{
	t.JsonSerializerOptions.IncludeFields = true;
	t.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
	t.JsonSerializerOptions.PropertyNamingPolicy = null;
});


var app = builder.Build();

app.UseHttpsRedirection();
app.MapFallbackToFile("index.html");

app.UseStaticFiles();

app.MapGet("/IFunny/GetSessionID", GetSessionID);

async ValueTask<HttpResult<Session>> GetSessionID()
{
	// have to instantiate a new one to prevent caching
	using HttpClient HttpClient = new HttpClient();

	using HttpRequestMessage message = new HttpRequestMessage(HttpMethod.Get, "https://ifunny.co/");

	message.Headers.Clear();
	message.Headers.Add("accept", "text/html,application/xhtml+xml," +
			"application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
	message.Headers.Add("accept-language", "en-US,en;q=0.9");
	message.Headers.Add("cache-control", "no-cache");
	message.Headers.Add("pragma", "no-cache");
	message.Headers.Add("sec-ch-ua", "\"Microsoft Edge\";v=\"95\"); \"Chromium\";v=\"95\"); \";Not A Brand\";v=\"99\"");
	message.Headers.Add("sec-ch-ua-mobile", "?0");
	message.Headers.Add("sec-ch-ua-platform", "\"Windows\"");
	message.Headers.Add("sec-fetch-dest", "document");
	message.Headers.Add("sec-fetch-mode", "navigate");
	message.Headers.Add("sec-fetch-site", "none");
	message.Headers.Add("sec-fetch-user", "?1");
	message.Headers.Add("upgrade-insecure-requests", "1");

	var response = await HttpClient.SendAsync(message);

	if (!response.IsSuccessStatusCode)
	{
		return new()
		{
			//Response = response,
			Message = response.ReasonPhrase
		};
	}

	if (!response.Headers.TryGetValues("set-cookie", out var result))
	{
		return new()
		{
			//Response = response,
			Message = "No 'set-cookie' found in headers"
		};
	}

	Session session = new();

	foreach (var item in result)
	{
		// set-cookie: x-csrf-token=6051b1117da07a0ec7f372a34bf27d1c; Path=/; Secure; SameSite=Lax
		if (item.StartsWith("x-csrf-token="))
		{
			session.CSRF = item.Substring(13, 32);
		}
		//set-cookie: CID=d78b838fd75967f39e58c3feae00a9983685aa52e5c0f9880126f3bdb3ae0589.091430d29cc92c2b; Max-Age=31536000; Path=/; Expires=Mon, 17 Oct 2022 00:31:27 GMT; HttpOnly; Secure; SameSite=Lax
		else if (item.StartsWith("CID="))
		{
			var split = item.Split(';', StringSplitOptions.TrimEntries);
			session.ClientID = split[0].Substring("CID=".Length);
			foreach (var s in split)
			{
				if (s.StartsWith("Expires="))
				{
					session.ExpirationDate = DateTime.Parse(s.Substring("Expires=".Length));
				}
			}
		}
	}


	// keep on trying
	if (session.CSRF is null)
	{
		return await GetSessionID();
	}

	return new()
	{
		//Response = response,
		Result = session
	};
}

app.MapGet("IFunny/GetPage/{csrf}/{cid}/{page}", GetPage);

async ValueTask<HttpResult<string>> GetPage(string csrf, string cid, int page)
{
	using var HttpClient = new HttpClient();

	var message = new HttpRequestMessage(HttpMethod.Get, $"https://ifunny.co/api/v1/feeds?page={page}&type=featured");
	message.Headers.Add("x-csrf-token", csrf);
	message.Headers.Add("x-requested-with", "fetch");
	message.Headers.Add("cookie", $"x-csrf-token={csrf}; CID={cid}; viewMode=list; sound=on");
	var response = await HttpClient.SendAsync(message);

	if (!response.IsSuccessStatusCode)
	{
		return new()
		{
			Message = response.ReasonPhrase,
		};
	}

	try
	{
		var p = await response.Content.ReadAsStringAsync();
		return new()
		{
			Result = p,
		};
	}
	catch (Exception ex)
	{
		return new()
		{
			Message = ex.Message,
		};
	}
}

app.Run();
