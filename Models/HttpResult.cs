namespace IFunny.Models
{
	internal struct HttpResult<T>
	{
		public T Result { get; set; }
		public string? Message { get; set; }
	}
}