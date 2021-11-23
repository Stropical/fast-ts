#include <vector>

namespace Array
{
    template <class T>
    class FtsArr
    {
        std::vector<T> data;

        void push(T element)
        {
            Fts.push_back(element);
        }
    };
}