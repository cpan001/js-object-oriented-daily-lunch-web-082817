let store = {customers: [], meals: [], deliveries: [], employers: []}
let customerId = 0

class Customer {
  constructor(name, employer) {
    this.id = ++customerId;
    this.name = name;
    if(employer) {this.employerId = employer.id}
    store.customers.push(this)
  }

  meals() {
    return this.deliveries().map(function(delivery) {return delivery.meal()});
  }

  deliveries() {
    return store.deliveries.filter(delivery => delivery.customerId === this.id);
  }

  totalSpent() {
    return this.meals().reduce(function(sum, meal) {return sum + meal.price}, 0);
  }

}

let mealId = 0

class Meal {
  constructor(title, price) {
    this.id = ++mealId;
    this.title = title;
    this.price = price;
    store.meals.push(this);
  }

  deliveries() {
    return store.deliveries.filter(delivery => delivery.mealId === this.id);
  }

  customers() {
    return this.deliveries().map(function(delivery) {return delivery.customer()});
  }

  static byPrice() {
    return store.meals.sort(function(a,b) {return b["price"] - a["price"]})
  }
}

let deliveryId = 0
class Delivery {

  constructor(meal, customer) {
    this.id = ++deliveryId
    if(meal) {this.mealId = meal.id}
    if(customer) {this.customerId = customer.id}
    store.deliveries.push(this);
  }

  meal() {
    return store.meals.find(meal => this.mealId === meal.id)
  }

  customer() {
    return store.customers.find(customer => this.customerId === customer.id)
  }

}

let employerId = 0

class Employer {
  constructor(name) {
    this.id = ++employerId;
    this.name = name;
    store.employers.push(this);
  }
  //missing tests
  employees() {
    return store.customers.filter(customer => customer.employerId === this.id);
  }

  deliveries() {
    const deliveries = this.employees().map(function(employee) {return employee.deliveries()})
    return deliveries.reduce(function(a,b) {return a.concat(b)}, [])
  }

  meals() {
    let all_meals = []
    this.deliveries().forEach(
      function(delivery) {
        if (!all_meals.includes(delivery.meal())) {
          all_meals.push(delivery.meal())
        }
      }
    )
    return all_meals
  }

  mealTotals() {
    return this.deliveries().reduce(
      function (acc, delivery) {
        let deliveryMealId = delivery.mealId
        if (acc[deliveryMealId]) {
          acc[deliveryMealId] += 1
        } else {
          acc[deliveryMealId] = 1
        }
      return acc;
      }
    , {})
  }
}
