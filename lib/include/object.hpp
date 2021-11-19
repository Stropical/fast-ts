#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"
#include <vector>

using namespace rapidjson;
typedef Document Object;

namespace JSON {
    void parse(Object &refObj, std::string raw) {
        refObj.Parse<0>(raw.c_str());
    }

    std::string stringify(Object &refObj) {
        StringBuffer buffer;
        Writer<StringBuffer> writer(buffer);
        refObj.Accept(writer);
        return buffer.GetString();
    }
};