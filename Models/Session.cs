namespace IFunny.Models
{
	internal struct Session
	{
		public DateTime ExpirationDate { get; set; }
		public string ClientID { get; set; }
		public string CSRF { get; set; }
	}
}