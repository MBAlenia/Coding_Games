-- Supprimer les questions existantes pour l'assessment 18
DELETE FROM questions WHERE assessment_id = 18;

-- Ajouter des questions détaillées avec des instructions claires
INSERT INTO questions (assessment_id, title, description, template_code, test_cases, difficulty, points, language) VALUES 
(18, 'REST API - User Controller', 
'Créez un contrôleur REST Spring Boot pour gérer des utilisateurs.

EXIGENCES:
1. Créez une classe User avec les attributs suivants:
   - Long id
   - String username (obligatoire, unique)
   - String email (obligatoire, format email valide)
   - String firstName
   - String lastName

2. Implémentez les endpoints suivants:
   - GET /api/users : Retourne la liste de tous les utilisateurs
   - GET /api/users/{id} : Retourne un utilisateur par son ID
   - POST /api/users : Crée un nouvel utilisateur
   - PUT /api/users/{id} : Met à jour un utilisateur existant
   - DELETE /api/users/{id} : Supprime un utilisateur

3. Utilisez les annotations Spring appropriées (@RestController, @RequestMapping, @GetMapping, etc.)

4. Retournez des ResponseEntity avec les codes HTTP appropriés:
   - 200 OK pour les succès
   - 201 Created pour la création
   - 404 Not Found si l\'utilisateur n\'existe pas
   - 400 Bad Request pour les données invalides', 
'import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.*;

// Classe User
class User {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    
    // TODO: Ajoutez constructeurs, getters et setters
}

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    // Simuler une base de données en mémoire
    private Map<Long, User> users = new HashMap<>();
    private Long nextId = 1L;
    
    // TODO: Implémentez GET /api/users
    
    // TODO: Implémentez GET /api/users/{id}
    
    // TODO: Implémentez POST /api/users
    
    // TODO: Implémentez PUT /api/users/{id}
    
    // TODO: Implémentez DELETE /api/users/{id}
}', 
'[{"test": "GET /api/users", "expected": "Liste des utilisateurs"}, {"test": "POST /api/users", "expected": "Utilisateur créé avec ID"}]', 
2, 100, 'java'),

(18, 'JPA Repository - Requêtes personnalisées', 
'Créez un repository JPA avec des méthodes de requête personnalisées.

CONTEXTE:
Vous travaillez sur une application de gestion d\'employés avec la structure suivante:

Employee:
- Long id
- String email (unique)
- String department
- Double salary
- LocalDate hireDate
- Boolean active

TÂCHES À RÉALISER:
1. Créez l\'interface EmployeeRepository qui étend JpaRepository<Employee, Long>

2. Ajoutez les méthodes de requête suivantes (utilisez les conventions de nommage Spring Data JPA):
   - Trouver tous les employés par département
   - Trouver un employé par email
   - Trouver tous les employés actifs
   - Trouver les employés avec un salaire supérieur à un montant donné
   - Trouver les employés embauchés après une date donnée
   - Compter le nombre d\'employés par département
   - Trouver les employés actifs d\'un département avec un salaire dans une fourchette

3. Ajoutez une requête JPQL personnalisée pour:
   - Obtenir le salaire moyen par département
   - Mettre à jour le statut actif de tous les employés d\'un département', 
'import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    // TODO: Trouver tous les employés par département
    // Méthode: findByDepartment(String department)
    
    // TODO: Trouver un employé par email
    // Méthode: findByEmail(String email)
    
    // TODO: Trouver tous les employés actifs
    // Méthode: findByActiveTrue()
    
    // TODO: Trouver les employés avec salaire > montant
    // Méthode: findBySalaryGreaterThan(Double salary)
    
    // TODO: Trouver les employés embauchés après une date
    // Méthode: findByHireDateAfter(LocalDate date)
    
    // TODO: Compter les employés par département
    // Méthode: countByDepartment(String department)
    
    // TODO: Employés actifs d\'un département avec salaire entre min et max
    // Méthode: findByDepartmentAndActiveTrueAndSalaryBetween(...)
    
    // TODO: Requête JPQL - Salaire moyen par département
    // @Query("SELECT e.department, AVG(e.salary) FROM Employee e GROUP BY e.department")
    
    // TODO: Requête JPQL - Mettre à jour le statut actif
    // @Query("UPDATE Employee e SET e.active = :status WHERE e.department = :dept")
}', 
'[{"test": "findByDepartment", "expected": "Liste des employés du département"}, {"test": "findByEmail", "expected": "Optional<Employee>"}]', 
2, 100, 'java'),

(18, 'Service Layer - Logique métier', 
'Implémentez une couche service avec validation et gestion des erreurs.

CONTEXTE:
Créez un service pour gérer des commandes (Order) avec les règles métier suivantes:

Order:
- Long id
- String customerEmail
- List<OrderItem> items
- Double totalAmount
- OrderStatus status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- LocalDateTime createdAt

OrderItem:
- Long productId
- String productName
- Integer quantity (min: 1, max: 100)
- Double unitPrice
- Double subtotal

RÈGLES MÉTIER:
1. Une commande doit avoir au moins 1 article
2. Le montant total minimum est de 10€
3. Le montant total maximum est de 10000€
4. On ne peut annuler qu\'une commande en statut PENDING ou CONFIRMED
5. La progression des statuts doit être: PENDING -> CONFIRMED -> SHIPPED -> DELIVERED
6. Calculer automatiquement le montant total et les sous-totaux

TÂCHES:
1. Créez la classe OrderService avec les méthodes suivantes:
   - createOrder(OrderDTO orderDto): Valider et créer une commande
   - confirmOrder(Long orderId): Confirmer une commande PENDING
   - shipOrder(Long orderId): Expédier une commande CONFIRMED
   - cancelOrder(Long orderId): Annuler une commande (vérifier les règles)
   - calculateTotal(List<OrderItem> items): Calculer le montant total

2. Gérez les exceptions avec des messages clairs:
   - OrderNotFoundException
   - InvalidOrderException
   - OrderStatusException', 
'import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class OrderService {
    
    // Simuler un repository
    private Map<Long, Order> orders = new HashMap<>();
    private Long nextId = 1L;
    
    // TODO: Méthode createOrder
    public Order createOrder(OrderDTO orderDto) {
        // 1. Valider que la commande a au moins 1 article
        // 2. Calculer le montant total
        // 3. Valider montant min (10€) et max (10000€)
        // 4. Créer la commande avec status PENDING
        // 5. Sauvegarder et retourner la commande
        return null;
    }
    
    // TODO: Méthode confirmOrder
    public Order confirmOrder(Long orderId) {
        // 1. Trouver la commande ou lancer OrderNotFoundException
        // 2. Vérifier que le statut est PENDING
        // 3. Changer le statut à CONFIRMED
        // 4. Retourner la commande mise à jour
        return null;
    }
    
    // TODO: Méthode shipOrder
    public Order shipOrder(Long orderId) {
        // 1. Trouver la commande
        // 2. Vérifier que le statut est CONFIRMED
        // 3. Changer le statut à SHIPPED
        return null;
    }
    
    // TODO: Méthode cancelOrder
    public Order cancelOrder(Long orderId) {
        // 1. Trouver la commande
        // 2. Vérifier que le statut est PENDING ou CONFIRMED
        // 3. Si non, lancer OrderStatusException
        // 4. Changer le statut à CANCELLED
        return null;
    }
    
    // TODO: Méthode calculateTotal
    private Double calculateTotal(List<OrderItem> items) {
        // Calculer la somme des (quantity * unitPrice) pour chaque item
        return 0.0;
    }
}', 
'[{"test": "createOrder", "expected": "Commande créée avec validation"}, {"test": "cancelOrder", "expected": "Exception si statut invalide"}]', 
3, 150, 'java');
