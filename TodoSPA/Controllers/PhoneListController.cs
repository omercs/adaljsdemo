using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using TodoSPA.Models;

namespace TodoSPA.Controllers
{
    public class PhoneListController : ApiController
    {
        // GET: api/TodoList
        public IEnumerable<Phone> Get()
        {
            Phone nexus = new Phone();
            nexus.Id = 1;
            nexus.Age = 1;
            nexus.Name = "Nexus";
            nexus.Snippet = "Nexus phone";

            Phone moto = new Phone();
            moto.Id = 2;
            moto.Age = 2;
            moto.Name = "moto";
            moto.Snippet = "Moto phone";

            List<Phone> phones = new List<Phone>();
            phones.Add(nexus);
            phones.Add(moto);

            return phones;
        }
    }
}