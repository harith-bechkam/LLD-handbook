

# SOLID-Principles

# S - single responsibility principle
# O - Open/closed principle
# L - Liskov substitution principle
# I - interface segregation principle
# D - Dependency Inversion

# S
A class should have only one reason to change, meaning it should have only one job or responsibility.

# O
Software entities should be open for extension but closed for modification. This allows adding new functionality without altering existing code.
In simpler terms:
You should be able to add new behavior without changing existing code.
This helps avoid bugs in working code and supports scalability.

# L
Parent class methods can be used by a child class(or derived class). But whenever the child class overrides or changes a method, it should not break the expected behavior of the parent class.
 If the parent method expects some behavior, the child must preserve or enhance it, not break it.
