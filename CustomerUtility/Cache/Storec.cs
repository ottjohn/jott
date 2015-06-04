using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Caching;

namespace CustomerUtility.Cache
{
    public static class CasheStore
    {
        /// <summary>
        /// Get Method. Key must be defined in consumer
        /// </summary>
        /// <param name="ItemName"></param>
        /// <returns></returns>
        public static Object GetCachedItem(string ItemName)
        {
            ObjectCache GeneralCache = MemoryCache.Default;
            return GeneralCache.Get(ItemName);
        }

        public static void SetCachedItem(string ItemName, object ItemToBeCached)
        {
            ObjectCache GeneralCache = MemoryCache.Default;
            GeneralCache.Set(ItemName, ItemToBeCached, new CacheItemPolicy());
        }

        public static void RemoveCachedItem(string ItemName)
        {
            ObjectCache GeneralCache = MemoryCache.Default;
            GeneralCache.Remove(ItemName);
        }
    }
}
