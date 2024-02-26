---
title: SpringBoot接收前端传来的json数据
tags:
  - Java
categories:
  - Java
  - Spring Boot
date: 2022-09-06 18:19:16
index_img: https://i.ytimg.com/vi/c7oV1T2j5mc/maxresdefault.jpg
banner_img: https://i.ytimg.com/vi/c7oV1T2j5mc/maxresdefault.jpg
---

当前端传来json数据时，后端有多种方式接收
前端json数据：

```json
{
	id:121,      //数字
	name:"lhj",     //字符串
	scoreList:[     //对象
				{Java:95},  
				{Python:98},
				{C++:94}
				]
}
```

# 一、使用POJO

若前端传递过来的数据刚好和我们的bean实体对象属性一致，则可以使用对象的形式接收。

后端实体类

```java
@Component
public class Score {
    private int id;
    private String name;
    private List<ScoreList> scoreList;
}
```

后端Controller

```java
@PostMapping("/student/score")
public void getScore(@RequestBody Score score){
	System.out.println(score);
}
```

- 前端数据和bean对象属性要一致
- 必须使用`@RequestBody`注解

# 二、使用Map接收

后台Controller

```java
@PostMapping("/lhj/getdata")
public void getData(@RequestBody Map<String,Object>map){
	System.out.println(map);
}
```

前端传来的是一个json对象时：{【id，name】},可以用Map来获取

```java
@RequestMapping(value = "/update")
@ResponseBody
public String updateAttr(@RequestBody Map<String, String> map) {
    if(map.containsKey("id"){
        Integer id = Integer.parseInt(map.get("id"));
    }
    if(map.containsKey("name"){
        String objname = map.get("name").toString();
    }
    // 操作 ...
    return "success";
}
```


对于`Map<String,Object>`，值的类型建议设置为Object，这样可以使Map能接收各种类型的数据，如字符串、数字、数组和对象等。

# 三、以RequestParam接收

**前端传来的是json数据不多时**：[id:id],可以直接用`@RequestParam`来获取值

```java
@RequestMapping(value = "/update") @ResponseBody public String updateAttr(@RequestParam ("id") int id) {
    int res=xxService.deleteData(id);
    return "success"; 
}
```

# 四、以List接收

**当前端传来这样一个json数组：`[{id,name},{id,name},{id,name},…]`时，用List接收**

```java
@RequestMapping(value = "/update")
@ResponseBody
public String updateAttr(@RequestBody List<Accomodation> list) {
    for(Accomodation accomodation:list){
        System.out.println(accomodation.toString());
    }
    return "success";
}
```

# 五、以JSONobject形式接收

此接收匹配所有的类型，需要前后台传参数对应

```java
@ResponseBody
	@PostMapping("/info")
	public JSONObject merchantForInfo(@RequestBody JSONObject jsonObject) {
Integer type = jsonObject.getInteger("type");
		String bankname = jsonObject.getString("bankname");
		String bankcard = jsonObject.getString("bankcard");
		String idno = jsonObject.getString("idno");
}
```
