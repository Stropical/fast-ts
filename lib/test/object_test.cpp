#include <string>
#include "arc.hpp"


int main() {
    std::string testJSON = "{\"declarations\": [{\"name\": {\"escapedText\": \"Var1\"}}, {\"name\": {\"escapedText\": \"Var2\"}}]}";

    Object obj;
    JSON::parse(obj, testJSON);
    std::cout << obj["declarations"][0]["name"]["escapedText"].GetString() << std::endl;
    std::cout << JSON::stringify(obj) << std::endl;
}